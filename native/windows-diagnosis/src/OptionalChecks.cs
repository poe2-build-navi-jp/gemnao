using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;

namespace Gemnao.Diagnostics
{
    internal static class OptionalChecks
    {
        internal static void ReadGameTraces(Snapshot s,string game,CancellationToken token)
        {
            var f=s.Wilds;f.TraceStatus=ReadStatus.Complete;string directory=Path.GetDirectoryName(game);
            foreach(var item in TraceEvidence.KnownFiles)
            {
                if(token.IsCancellationRequested){f.TraceStatus=ReadStatus.Cancelled;return;}
                var result=new TraceFact { Id=item.Id };f.Traces.Add(result);
                string path=Path.Combine(directory,item.Name);
                try
                {
                    FileAttributes attrs;
                    try { attrs=File.GetAttributes(path); }
                    catch(FileNotFoundException) { result.State=TraceState.Absent;continue; }
                    catch(DirectoryNotFoundException) { result.State=TraceState.Absent;continue; }
                    if((attrs&FileAttributes.ReparsePoint)!=0 || ((attrs&FileAttributes.Directory)!=0)!=item.Directory){result.State=TraceState.Unsupported;f.TraceStatus=ReadStatus.Partial;continue;}
                    result.State=TraceState.Present;
                    if(item.Dll && LocalGuard.Allowed(path) && new FileInfo(path).Length<=32L*1024*1024)
                    {
                        var info=FileVersionInfo.GetVersionInfo(path);
                        result.Marker=TraceEvidence.ProductMarker(info.ProductName,info.FileDescription);
                    }
                }
                catch(UnauthorizedAccessException) { result.State=TraceState.Denied;f.TraceStatus=ReadStatus.Partial; }
                catch { result.State=TraceState.Unsupported;f.TraceStatus=ReadStatus.Partial; }
            }
            f.HistoryStatus=ReadStatus.Unavailable;
            try
            {
                string common=Path.GetDirectoryName(directory),apps=Path.GetDirectoryName(common);
                if(!string.Equals(Path.GetFileName(common),"common",StringComparison.OrdinalIgnoreCase)||!string.Equals(Path.GetFileName(apps),"steamapps",StringComparison.OrdinalIgnoreCase))return;
                string manifest=Path.Combine(apps,"appmanifest_2246340.acf");
                string text=LocalGuard.ReadSmall(manifest,131072);
                if(!string.Equals(SteamText.InstallDirectory(text),Path.GetFileName(directory),StringComparison.OrdinalIgnoreCase))return;
                f.History=TraceEvidence.LaunchHistory(text,s.CollectedUtc);f.HistoryStatus=ReadStatus.Complete;
            }
            catch(UnauthorizedAccessException){f.HistoryStatus=ReadStatus.AccessDenied;}
            catch { f.HistoryStatus=ReadStatus.Unavailable; }
        }
        internal static CrashArchiveFacts ReadArchive(string path,CancellationToken token,SteamModuleContext context=null)
        {
            try
            {
                if(!LocalGuard.Allowed(path))return new CrashArchiveFacts{Status=ArchiveStatus.Unavailable};
                using(var input=new FileStream(path,FileMode.Open,FileAccess.Read,FileShare.Read))using(var output=new MemoryStream())
                {
                    if(input.Length>CrashArchive.MaxZip)return new CrashArchiveFacts{Status=ArchiveStatus.Rejected};
                    byte[] buffer=new byte[8192];int n;
                    while((n=input.Read(buffer,0,buffer.Length))>0)
                    {
                        if(token.IsCancellationRequested)return new CrashArchiveFacts{Status=ArchiveStatus.Cancelled};
                        if(output.Length+n>CrashArchive.MaxZip)return new CrashArchiveFacts{Status=ArchiveStatus.Rejected};output.Write(buffer,0,n);
                    }
                    return CrashArchive.Read(output.ToArray(),context);
                }
            }
            catch { return new CrashArchiveFacts{Status=ArchiveStatus.Unavailable}; }
        }
    }
}
