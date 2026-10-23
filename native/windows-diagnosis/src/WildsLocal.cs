using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading;
using Microsoft.Win32;

namespace Gemnao.Diagnostics
{
    internal static class LocalGuard
    {
        internal static bool Allowed(string path, bool allowMissingLeaf = false)
        {
            // No UNC/device paths, remote drives, junctions, symlinks, or mount-point traversal.
            if (!SteamText.IsLocalDirectory(path)) return false;
            try
            {
                string full=Path.GetFullPath(path), root=Path.GetPathRoot(full);
                if(new DriveInfo(root).DriveType!=DriveType.Fixed)return false;
                string[] parts=full.Substring(root.Length).Split(new[]{'\\'},StringSplitOptions.RemoveEmptyEntries);
                string at=root;
                for(int i=0;i<parts.Length;i++)
                {
                    at=Path.Combine(at,parts[i]);
                    try { if((File.GetAttributes(at)&FileAttributes.ReparsePoint)!=0)return false; }
                    catch(FileNotFoundException) { return allowMissingLeaf && i==parts.Length-1; }
                    catch(DirectoryNotFoundException) { return allowMissingLeaf && i==parts.Length-1; }
                }
                return true;
            }
            catch { return false; }
        }
        internal static string ReadSmall(string path, int maxBytes)
        {
            if(!Allowed(path))throw new IOException("Not an allowed local file.");
            using(var file=new FileStream(path,FileMode.Open,FileAccess.Read,FileShare.ReadWrite | FileShare.Delete))
            {
                if(file.Length>maxBytes)throw new IOException("File too large.");
                byte[] bytes=new byte[maxBytes+1]; int count=0,n;
                while(count<bytes.Length && (n=file.Read(bytes,count,bytes.Length-count))>0)count+=n;
                if(count>maxBytes)throw new IOException("File grew too large.");
                return new UTF8Encoding(false,true).GetString(bytes,0,count).TrimStart('\uFEFF');
            }
        }
    }
    internal sealed class DiscoveryResult
    {
        internal readonly List<SteamEntry> Entries = new List<SteamEntry>();
        internal bool Incomplete;
    }
    internal static class SteamDiscovery
    {
        internal static DiscoveryResult Find(CancellationToken cancel)
        {
            var result=new DiscoveryResult(); var roots=new List<string>();
            // Read one ordinary install-location value only; never enumerate account/userdata keys.
            try { using(var key=Registry.CurrentUser.OpenSubKey(@"Software\Valve\Steam", false)) { var s=key?.GetValue("SteamPath") as string; if(SteamText.IsLocalDirectory(s))roots.Add(Path.GetFullPath(SteamText.NormalizeLocalPath(s))); } }
            catch { result.Incomplete=true; }
            foreach(var folder in new[]{Environment.SpecialFolder.ProgramFilesX86,Environment.SpecialFolder.ProgramFiles})
            {
                string p=Environment.GetFolderPath(folder); if(!string.IsNullOrEmpty(p))roots.Add(Path.Combine(p,"Steam"));
            }
            foreach(string steam in roots.Select(x=>Path.GetFullPath(SteamText.NormalizeLocalPath(x))).Distinct(StringComparer.OrdinalIgnoreCase).Take(3))
            {
                if(cancel.IsCancellationRequested) { result.Incomplete=true; break; }
                if(!LocalGuard.Allowed(steam))continue;
                string steamExe=Path.Combine(steam,"steam.exe"); if(!LocalGuard.Allowed(steamExe))steamExe=null;
                var libraries=new List<string>{steam};
                string vdf=Path.Combine(steam,"steamapps","libraryfolders.vdf");
                if(LocalGuard.Allowed(vdf) && File.Exists(vdf))
                {
                    try { libraries.AddRange(SteamText.LibraryPaths(LocalGuard.ReadSmall(vdf,1048576)).Select(x=>Path.GetFullPath(SteamText.NormalizeLocalPath(x)))); }
                    catch { result.Incomplete=true; }
                }
                foreach(string lib in libraries.Distinct(StringComparer.OrdinalIgnoreCase).Take(16))
                {
                    if(cancel.IsCancellationRequested) { result.Incomplete=true; break; }
                    if(!LocalGuard.Allowed(lib))continue;
                    string manifest=Path.Combine(lib,"steamapps","appmanifest_2246340.acf");
                    if(!LocalGuard.Allowed(manifest) || !File.Exists(manifest))continue;
                    try
                    {
                        string name=SteamText.InstallDirectory(LocalGuard.ReadSmall(manifest,131072));
                        if(name==null) { result.Incomplete=true; continue; }
                        string game=Path.GetFullPath(Path.Combine(lib,"steamapps","common",name,WildsProfile.ExeName));
                        if(!LocalGuard.Allowed(game) || !WildsProfile.IsTarget(game))continue;
                        var prior=result.Entries.FirstOrDefault(x=>string.Equals(x.GamePath,game,StringComparison.OrdinalIgnoreCase));
                        if(prior==null)result.Entries.Add(new SteamEntry{GamePath=game,SteamExe=steamExe});
                        else if(!string.Equals(prior.SteamExe,steamExe,StringComparison.OrdinalIgnoreCase)){prior.SteamExe=null;result.Incomplete=true;}
                    }
                    catch { result.Incomplete=true; }
                }
            }
            return result;
        }
    }
    internal static class WildsLocal
    {
        internal static void Collect(Snapshot s, string game, string steam, CancellationToken cancel, bool readTraces = false, bool readArchive = false, bool readSteam = false, bool wildsProfile = true)
        {
            s.Wilds.Is64BitWindows=Environment.Is64BitOperatingSystem;
            if(cancel.IsCancellationRequested) { s.Wilds.FileStatus=s.Wilds.CompatibilityStatus=s.Wilds.CrashFolderStatus=ReadStatus.Cancelled; return; }
            if(!LocalGuard.Allowed(game)) { s.Wilds.FileStatus=s.Wilds.CompatibilityStatus=s.Wilds.CrashFolderStatus=ReadStatus.Unavailable; if(readArchive)s.Archive.Status=ArchiveStatus.Unavailable; return; }
            try { var info=FileVersionInfo.GetVersionInfo(game); s.Wilds.GameVersionParts=string.IsNullOrEmpty(info.FileVersion)?new int[0]:new[]{info.FileMajorPart,info.FileMinorPart,info.FileBuildPart,info.FilePrivatePart}; s.Wilds.FileStatus=ReadStatus.Complete; }
            catch(UnauthorizedAccessException) { s.Wilds.FileStatus=ReadStatus.AccessDenied; }
            catch { s.Wilds.FileStatus=ReadStatus.Unavailable; }
            ReadCompatibility(s.Wilds,game,steam);
            // Generic collection never opens game folders, appmanifest or arbitrary ZIPs.
            if(wildsProfile && WildsProfile.IsTarget(game))
            {
                if(readTraces)OptionalChecks.ReadGameTraces(s,game,cancel);
                ReadCrashMetadata(s,game,cancel,readArchive,readSteam?SteamLocal.Context(steam):null);
            }
        }
        private static void ReadCompatibility(WildsFacts facts,string game,string steam)
        {
            facts.CompatibilityStatus=string.IsNullOrEmpty(steam)?ReadStatus.Partial:ReadStatus.Complete;
            foreach(var hive in new[]{RegistryHive.CurrentUser,RegistryHive.LocalMachine})
            foreach(var view in new[]{RegistryView.Registry64,RegistryView.Registry32})
            {
                try
                {
                    using(var root=RegistryKey.OpenBaseKey(hive,view))
                    using(var key=root.OpenSubKey(@"Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers",false))
                    {
                        string gameValue=key?.GetValue(game) as string;
                        facts.GameCompatibility |= WildsProfile.HasCompatibilityFlag(gameValue);
                        facts.GameAdminFlag |= WildsProfile.HasAdminFlag(gameValue);
                        if(!string.IsNullOrEmpty(steam))facts.SteamCompatibility |= WildsProfile.HasCompatibilityFlag(key?.GetValue(steam) as string);
                    }
                }
                catch(UnauthorizedAccessException) { facts.CompatibilityStatus=ReadStatus.AccessDenied; }
                catch(SecurityException) { facts.CompatibilityStatus=ReadStatus.AccessDenied; }
                catch { facts.CompatibilityStatus=ReadStatus.Partial; }
            }
        }
        private static void ReadCrashMetadata(Snapshot s,string game,CancellationToken cancel,bool readArchive,SteamModuleContext context)
        {
            string folder=Path.Combine(Path.GetDirectoryName(game),"CrashReport");
            string newest=null; DateTime newestTime=DateTime.MinValue;
            if(readArchive)s.Archive.Status=ArchiveStatus.NotFound;
            try
            {
                // Attributes distinguish absent from denied; do not follow directory junctions.
                FileAttributes attrs;
                try { attrs=File.GetAttributes(folder); }
                catch(DirectoryNotFoundException) { s.Wilds.CrashFolderStatus=ReadStatus.Complete; return; }
                catch(FileNotFoundException) { s.Wilds.CrashFolderStatus=ReadStatus.Complete; return; }
                if((attrs&FileAttributes.ReparsePoint)!=0 || (attrs&FileAttributes.Directory)==0) { s.Wilds.CrashFolderStatus=ReadStatus.Unavailable; if(readArchive)s.Archive.Status=ArchiveStatus.Unavailable; return; }
                s.Wilds.CrashFolderPresent=true;
                int total=0;
                foreach(string file in Directory.EnumerateFiles(folder,"*",SearchOption.TopDirectoryOnly))
                {
                    if(cancel.IsCancellationRequested) { s.Wilds.CrashFolderStatus=ReadStatus.Cancelled; return; }
                    if(total++>=64) { s.Wilds.CrashLimitReached=true; s.Wilds.CrashFolderStatus=ReadStatus.Partial; break; }
                    if(!string.Equals(Path.GetExtension(file),".zip",StringComparison.OrdinalIgnoreCase))continue;
                    if((File.GetAttributes(file)&FileAttributes.ReparsePoint)!=0)continue;
                    s.Wilds.CrashFilesExamined++;
                    DateTime modified=File.GetLastWriteTimeUtc(file);
                    if(modified>newestTime) { newest=file; newestTime=modified; }
                    if(modified>=s.StartUtc && modified<=s.EndUtc)s.Wilds.CrashFilesInWindow++;
                }
                if(!s.Wilds.CrashLimitReached)s.Wilds.CrashFolderStatus=ReadStatus.Complete;
                if(readArchive && newest!=null)s.Archive=OptionalChecks.ReadArchive(newest,cancel,context);
            }
            catch(UnauthorizedAccessException) { s.Wilds.CrashFolderStatus=ReadStatus.AccessDenied; if(readArchive)s.Archive.Status=ArchiveStatus.Unavailable; }
            catch(SecurityException) { s.Wilds.CrashFolderStatus=ReadStatus.AccessDenied; if(readArchive)s.Archive.Status=ArchiveStatus.Unavailable; }
            catch { s.Wilds.CrashFolderStatus=ReadStatus.Unavailable; if(readArchive)s.Archive.Status=ArchiveStatus.Unavailable; }
        }
    }
}
