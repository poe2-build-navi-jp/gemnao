using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Gemnao.Diagnostics
{
    public enum ArchiveStatus { NotRequested, NotFound, Read, Rejected, Unavailable, Cancelled }
    public sealed class CrashArchiveFacts
    {
        public ArchiveStatus Status;
        public bool TextRead, DumpRead, UnsupportedParts;
        public int EntryCount, ModuleCount;
        public string TextException = "", DumpException = "";
        public bool TextAdminFlag, SteamOverlayListed;
        public DateTime? DumpCreatedUtc;
        public EventFact Fault = new EventFact();
        public bool ClientModulesChecked;
        public readonly List<SteamModuleFact> GameClientModules=new List<SteamModuleFact>();
        // No raw text, memory, stack, directory listing, command line or entry names are retained.
    }
    public static class CrashArchive
    {
        public const int MaxZip = 8 * 1024 * 1024;
        public const int MaxDump = 16 * 1024 * 1024;
        public const int MaxText = 64 * 1024;
        private static ushort U16(byte[] b,int p) { Bounds(b,p,2); return (ushort)(b[p]|b[p+1]<<8); }
        private static uint U32(byte[] b,int p) { Bounds(b,p,4); return (uint)(b[p]|b[p+1]<<8|b[p+2]<<16|b[p+3]<<24); }
        private static ulong U64(byte[] b,int p) { return U32(b,p)|((ulong)U32(b,p+4)<<32); }
        private static void Bounds(byte[] b,long p,long count) { if(p<0||count<0||p>b.Length||count>b.Length-p)throw new FormatException(); }
        private static int Pos(uint p) { if(p>int.MaxValue)throw new FormatException();return (int)p; }
        private static void CheckZip(byte[] bytes)
        {
            if(bytes==null||bytes.Length<22||bytes.Length>MaxZip)throw new FormatException();
            int end=-1;
            for(int p=bytes.Length-22;p>=Math.Max(0,bytes.Length-65557);p--)if(U32(bytes,p)==0x06054b50 && p+22+U16(bytes,p+20)==bytes.Length) { end=p;break; }
            if(end<0||U16(bytes,end+4)!=0||U16(bytes,end+6)!=0)throw new FormatException();
            int entries=U16(bytes,end+10); if(entries<1||entries>16||U16(bytes,end+8)!=entries)throw new FormatException();
            long directory=U32(bytes,end+16),size=U32(bytes,end+12); if(size>1048576||directory+size>end)throw new FormatException();
            int at=(int)directory; long total=0;
            for(int i=0;i<entries;i++)
            {
                Bounds(bytes,at,46); if(U32(bytes,at)!=0x02014b50)throw new FormatException();
                ushort flags=U16(bytes,at+8),method=U16(bytes,at+10);
                if((flags&1)!=0||(method!=0&&method!=8)||U16(bytes,at+34)!=0)throw new FormatException();
                uint compressed=U32(bytes,at+20),length=U32(bytes,at+24),attrs=U32(bytes,at+38),local=U32(bytes,at+42);
                if(length>MaxDump||compressed>MaxZip||(length>0&&compressed==0)||(compressed>0&&(long)length>compressed*300L))throw new FormatException();
                total+=length; if(total>32L*1024*1024 || ((attrs>>16)&0xF000)==0xA000)throw new FormatException();
                Bounds(bytes,local,30); if(U32(bytes,(int)local)!=0x04034b50 || (U16(bytes,(int)local+6)&1)!=0)throw new FormatException();
                int name=U16(bytes,at+28),extra=U16(bytes,at+30),comment=U16(bytes,at+32);
                Bounds(bytes,at+46,(long)name+extra+comment); at+=46+name+extra+comment;
            }
            if(at!=directory+size)throw new FormatException();
        }
        private static byte[] ReadEntry(ZipArchiveEntry entry,int limit)
        {
            if(entry.Length>limit)throw new FormatException();
            using(var stream=entry.Open())using(var output=new MemoryStream())
            {
                byte[] buffer=new byte[8192];int read;
                while((read=stream.Read(buffer,0,buffer.Length))>0)
                {
                    if(output.Length+read>limit||output.Length+read>entry.Length)throw new FormatException();
                    output.Write(buffer,0,read);
                }
                if(output.Length!=entry.Length)throw new FormatException();return output.ToArray();
            }
        }
        public static CrashArchiveFacts Read(byte[] archive,SteamModuleContext context=null)
        {
            var facts=new CrashArchiveFacts();
            try
            {
                CheckZip(archive);
                using(var memory=new MemoryStream(archive,false))using(var zip=new ZipArchive(memory,ZipArchiveMode.Read,false))
                {
                    if(zip.Entries.Count>16)throw new FormatException();
                    var names=new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                    foreach(var entry in zip.Entries)
                    {
                        string n=entry.FullName;
                        if(string.IsNullOrWhiteSpace(n)||n.Length>100||n=="."||n==".."||n.IndexOfAny(new[]{'/','\\',':','\0'})>=0||n.Any(c=>char.IsControl(c)||char.GetUnicodeCategory(c)==UnicodeCategory.Format)||!names.Add(n))throw new FormatException();
                    }
                    facts.EntryCount=zip.Entries.Count;
                    var text=zip.Entries.FirstOrDefault(x=>string.Equals(x.FullName,"CrashReport.txt",StringComparison.OrdinalIgnoreCase));
                    if(text!=null)
                    {
                        try { var temporary=new CrashArchiveFacts(); ParseText(new UTF8Encoding(false,true).GetString(ReadEntry(text,MaxText)).TrimStart('\uFEFF'),temporary); facts.TextRead=temporary.TextRead; if(!facts.TextRead)facts.UnsupportedParts=true; facts.TextException=temporary.TextException; facts.TextAdminFlag=temporary.TextAdminFlag; }
                        catch { facts.UnsupportedParts=true; }
                    }
                    var dump=zip.Entries.FirstOrDefault(x=>string.Equals(x.FullName,"MiniDump.dmp",StringComparison.OrdinalIgnoreCase));
                    if(dump!=null)
                    {
                        try { ParseDump(ReadEntry(dump,MaxDump),facts,context); }
                        catch { facts.DumpRead=false;facts.UnsupportedParts=true;facts.Fault=new EventFact();facts.DumpException="";facts.ModuleCount=0;facts.SteamOverlayListed=false;facts.DumpCreatedUtc=null;facts.ClientModulesChecked=false;facts.GameClientModules.Clear(); }
                    }
                    facts.Status=facts.TextRead||facts.DumpRead?ArchiveStatus.Read:ArchiveStatus.Unavailable;
                }
            }
            catch { facts=new CrashArchiveFacts { Status=ArchiveStatus.Rejected }; }
            return facts;
        }
        private static void ParseText(string text,CrashArchiveFacts facts)
        {
            if(text.Length>MaxText)throw new FormatException();
            bool process=false,found=false;
            foreach(string raw in text.Split('\n'))
            {
                string line=raw.Trim();
                if(line.StartsWith("[",StringComparison.Ordinal)) { process=line=="[Process Information]"; continue; }
                if(!process)continue;
                if(line.StartsWith("ExceptionCode",StringComparison.Ordinal))
                {
                    if(found)throw new FormatException();found=true;
                    var m=Regex.Match(line,@"\AExceptionCode\s*:\s*((?:0[xX])?[A-Fa-f0-9]{8})(?:\([A-Z_0-9]+\))?\z");
                    if(!m.Success)throw new FormatException();facts.TextException=CrashDetails.Exception(m.Groups[1].Value);
                }
                if(line.StartsWith("Mode",StringComparison.Ordinal))
                {
                    var m=Regex.Match(line,@"\AMode\s*:\s*([~ A-Za-z0-9_]{0,200})\z");
                    if(m.Success)facts.TextAdminFlag=WildsProfile.HasAdminFlag(m.Groups[1].Value);
                }
            }
            facts.TextRead=found;
        }
        private sealed class Module
        {
            internal ulong Base;
            internal uint Size;
            internal string Path;
            internal int[] Version;
        }
        private static void ParseDump(byte[] dump,CrashArchiveFacts facts,SteamModuleContext context)
        {
            Bounds(dump,0,32);
            if(U32(dump,0)!=0x504d444d || (U32(dump,4)&0xffff)!=0xa793)throw new FormatException();
            uint streams=U32(dump,8);int directory=Pos(U32(dump,12)); if(streams<1||streams>64)throw new FormatException();Bounds(dump,directory,streams*12L);
            int moduleAt=-1,exceptionAt=-1;uint moduleSize=0,exceptionSize=0;
            for(int i=0;i<streams;i++)
            {
                int p=directory+i*12;uint type=U32(dump,p),size=U32(dump,p+4);int at=Pos(U32(dump,p+8));Bounds(dump,at,size);
                if(type==4) { if(moduleAt>=0)throw new FormatException();moduleAt=at;moduleSize=size; }
                if(type==6) { if(exceptionAt>=0)throw new FormatException();exceptionAt=at;exceptionSize=size; }
            }
            if(moduleAt<0||exceptionAt<0||moduleSize<4||exceptionSize<168)throw new FormatException();
            uint count=U32(dump,moduleAt);if(count<1||count>512||4L+count*108L>moduleSize)throw new FormatException();
            var modules=new List<Module>();
            for(int i=0;i<count;i++)
            {
                int p=moduleAt+4+i*108;ulong start=U64(dump,p);uint size=U32(dump,p+8);
                if(size==0||start>ulong.MaxValue-size)throw new FormatException();
                int nameAt=Pos(U32(dump,p+20));uint nameBytes=U32(dump,nameAt);if(nameBytes<2||nameBytes>2048||nameBytes%2!=0)throw new FormatException();Bounds(dump,nameAt+4,nameBytes);
                string path=new UnicodeEncoding(false,false,true).GetString(dump,nameAt+4,(int)nameBytes);
                if(path.Any(c=>char.IsControl(c)||char.GetUnicodeCategory(c)==UnicodeCategory.Format))throw new FormatException();
                int[] version=new int[0];
                if(U32(dump,p+24)==0xfeef04bd) { uint ms=U32(dump,p+32),ls=U32(dump,p+36);version=new[]{(int)(ms>>16),(int)(ms&0xffff),(int)(ls>>16),(int)(ls&0xffff)}; }
                modules.Add(new Module{Base=start,Size=size,Path=path,Version=version});
            }
            uint code=U32(dump,exceptionAt+8);ulong address=U64(dump,exceptionAt+24);if(U32(dump,exceptionAt+32)>15)throw new FormatException();
            var hits=modules.Where(m=>address>=m.Base&&address-m.Base<m.Size).ToArray();if(hits.Length>1)throw new FormatException();
            var targets=modules.Where(m=>string.Equals(Rules.FileName(m.Path),WildsProfile.ExeName,StringComparison.OrdinalIgnoreCase)).ToArray();
            if(targets.Length!=1)throw new FormatException();var target=targets[0];
            var fault=new EventFact { Kind=EventKind.ApplicationCrash,Match=MatchKind.NameOnly,ExceptionCode=code.ToString("X8",CultureInfo.InvariantCulture) };
            if(hits.Length==1)
            {
                var hit=hits[0];
                CrashDetails.Attach(fault,target.Path,Rules.FileName(hit.Path),hit.Path,string.Join(".",target.Version),string.Join(".",hit.Version),(address-hit.Base).ToString("X",CultureInfo.InvariantCulture));
            }
            uint timestamp=U32(dump,20);
            if(timestamp>0)facts.DumpCreatedUtc=new DateTime(1970,1,1,0,0,0,DateTimeKind.Utc).AddSeconds(timestamp);
            facts.Fault=fault;facts.DumpException=fault.ExceptionCode;facts.ModuleCount=modules.Count;
            facts.SteamOverlayListed=modules.Any(m=>new[]{"gameoverlayrenderer64.dll","gameoverlayrenderer.dll"}.Contains(Rules.FileName(m.Path).ToLowerInvariant()));
            if(context!=null)
            {
                var limited=new SteamFacts();foreach(var m in modules)SteamEvidence.AddModule(limited,Rules.FileName(m.Path),m.Path,context.SteamRoot,context.WindowsSystem,context.WindowsX86);
                facts.GameClientModules.AddRange(limited.Modules);facts.ClientModulesChecked=true;
            }
            facts.DumpRead=true;
        }
        public static string Summary(CrashArchiveFacts f,Snapshot scan,bool knownNames=false)
        {
            var b=new StringBuilder(L.T("CrashArchive.001"));
            if(f.Status==ArchiveStatus.NotRequested)return b.AppendLine(L.T("CrashArchive.002")).ToString();
            if(f.Status==ArchiveStatus.NotFound)return b.AppendLine(L.T("CrashArchive.003")).ToString();
            if(f.Status!=ArchiveStatus.Read)return b.AppendLine(L.T("CrashArchive.004")).ToString();
            b.AppendLine("ZIP "+f.EntryCount+L.T("CrashArchive.005"));
            if(f.UnsupportedParts)b.AppendLine(L.T("CrashArchive.006"));
            if(f.TextRead)b.AppendLine(L.T("CrashArchive.007")+CrashDetails.Exception(f.TextException)+(f.TextAdminFlag?L.T("CrashArchive.008"):""));
            if(!f.DumpRead)b.AppendLine(L.T("CrashArchive.009"));
            if(f.DumpRead)
            {
                b.AppendLine(L.T("CrashArchive.010")+CrashDetails.Exception(f.DumpException)+" / "+(f.Fault.Module==ModuleKind.TargetExecutable?L.T("CrashArchive.011"):CrashDetails.ModuleText(f.Fault,knownNames))+L.T("CrashArchive.012")+CrashDetails.OffsetText(f.Fault.FaultOffset));
                b.AppendLine(L.T("CrashArchive.013")+CrashDetails.VersionText(f.Fault.AppVersionParts)+L.T("CrashArchive.014")+CrashDetails.VersionText(f.Fault.ModuleVersionParts));
                bool inWindow=f.DumpCreatedUtc.HasValue && f.DumpCreatedUtc.Value>=scan.StartUtc && f.DumpCreatedUtc.Value<=scan.EndUtc;
                if(!f.DumpCreatedUtc.HasValue)b.AppendLine(L.T("CrashArchive.015"));
                else if(!inWindow)b.AppendLine(L.T("CrashArchive.016"));
                else b.AppendLine(L.T("CrashArchive.017"));
                var complete=scan.Application.Events.Where(CrashDetails.CompleteSignature).ToArray();
                if(complete.Length>0)
                {
                    bool same=complete.Any(e=>e.ExceptionCode==f.DumpException && e.FaultOffset==f.Fault.FaultOffset && CrashDetails.VersionText(e.AppVersionParts)==CrashDetails.VersionText(f.Fault.AppVersionParts) && CrashDetails.VersionText(e.ModuleVersionParts)==CrashDetails.VersionText(f.Fault.ModuleVersionParts) && string.Equals(e.LocalModuleName,f.Fault.LocalModuleName,StringComparison.OrdinalIgnoreCase));
                    b.AppendLine(same?L.T("CrashArchive.018"):L.T("CrashArchive.019"));
                }
                b.AppendLine(L.T("CrashArchive.020")+f.ModuleCount+L.T("CrashArchive.021")+(f.SteamOverlayListed?L.T("CrashArchive.022"):L.T("CrashArchive.023")));
                if(f.ClientModulesChecked)
                {
                    b.AppendLine(L.T("CrashArchive.024"));
                    if(f.GameClientModules.Count==0)b.AppendLine(L.T("CrashArchive.025"));
                    foreach(var m in f.GameClientModules){var d=SteamEvidence.Items.FirstOrDefault(x=>x.Id==m.Id);if(d!=null)b.AppendLine("  "+d.Name+L.T("CrashArchive.026")+SteamEvidence.LocationText(m.Location));}
                    b.AppendLine(L.T("CrashArchive.027"));
                }
            }
            if(f.TextRead && f.DumpRead && f.TextException!=f.DumpException)b.AppendLine(L.T("CrashArchive.028"));
            if(f.TextException=="C000001D"||f.DumpException=="C000001D")b.AppendLine(L.T("CrashArchive.029"));
            b.AppendLine(L.T("CrashArchive.030"));return b.ToString();
        }
    }
}
