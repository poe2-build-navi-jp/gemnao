using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security;
using System.Threading;

namespace Gemnao.Diagnostics
{
    internal static class SteamLocal
    {
        internal static SteamModuleContext Context(string steam)
        {
            return new SteamModuleContext{SteamRoot=!string.IsNullOrEmpty(steam)&&LocalGuard.Allowed(steam)?Path.GetDirectoryName(Path.GetFullPath(steam)):null,WindowsSystem=Environment.GetFolderPath(Environment.SpecialFolder.System),WindowsX86=Environment.GetFolderPath(Environment.SpecialFolder.SystemX86)};
        }
        internal static void Read(SteamFacts facts,string selectedSteam,CancellationToken token)
        {
            if(string.IsNullOrEmpty(selectedSteam)||!string.Equals(Rules.FileName(selectedSteam),"steam.exe",StringComparison.OrdinalIgnoreCase)||!LocalGuard.Allowed(selectedSteam))
            {facts.FileStatus=facts.ProcessStatus=ReadStatus.Unavailable;return;}
            string steam=Path.GetFullPath(selectedSteam),root=Path.GetDirectoryName(steam);
            facts.RootSelected=true;facts.FileStatus=ReadStatus.Complete;
            foreach(var def in SteamEvidence.Items)
            {
                if(token.IsCancellationRequested){facts.FileStatus=facts.ProcessStatus=ReadStatus.Cancelled;return;}
                var f=new SteamFileFact{Id=def.Id};facts.Files.Add(f);string path=Path.Combine(root,def.Name);
                try
                {
                    var a=File.GetAttributes(path);
                    if((a&(FileAttributes.ReparsePoint|FileAttributes.Directory))!=0){f.State=TraceState.Unsupported;facts.FileStatus=ReadStatus.Partial;continue;}
                    f.State=TraceState.Present;f.Hidden=(a&FileAttributes.Hidden)!=0;
                }
                catch(FileNotFoundException){f.State=TraceState.Absent;}
                catch(DirectoryNotFoundException){f.State=TraceState.Absent;}
                catch(UnauthorizedAccessException){f.State=TraceState.Denied;facts.FileStatus=ReadStatus.Partial;}
                catch{f.State=TraceState.Unsupported;facts.FileStatus=ReadStatus.Partial;}
            }
            // No command lines, titles, account data, other app inventory, or module memory reads.
            Process[] processes=null;var elapsed=Stopwatch.StartNew();facts.ProcessStatus=ReadStatus.Complete;
            try
            {
                processes=Process.GetProcessesByName("steam");
                if(processes.Length>4){facts.ProcessLimitReached=true;facts.ProcessStatus=ReadStatus.Partial;}
                foreach(var process in processes.Take(4))
                {
                    if(token.IsCancellationRequested){facts.ProcessStatus=ReadStatus.Cancelled;return;}
                    if(elapsed.Elapsed>TimeSpan.FromSeconds(10)){facts.ProcessStatus=ReadStatus.TimedOut;return;}
                    try
                    {
                        process.Refresh();string exe=process.MainModule?.FileName;
                        if(exe==null||!string.Equals(Path.GetFullPath(exe),steam,StringComparison.OrdinalIgnoreCase))continue;
                        facts.MatchingProcessFound=true;
                        var modules=process.Modules;
                        if(modules.Count>1024){facts.ModuleLimitReached=true;facts.ProcessStatus=ReadStatus.Partial;}
                        for(int i=0;i<Math.Min(1024,modules.Count);i++)
                        {
                            if(token.IsCancellationRequested){facts.ProcessStatus=ReadStatus.Cancelled;return;}
                            if(elapsed.Elapsed>TimeSpan.FromSeconds(10)){facts.ProcessStatus=ReadStatus.TimedOut;return;}
                            var module=modules[i];var known=SteamEvidence.Known(module.ModuleName);
                            if(known==null||!known.Module)continue;
                            string path=module.FileName;
                            string system=Environment.GetFolderPath(Environment.SpecialFolder.System),system32=Environment.GetFolderPath(Environment.SpecialFolder.SystemX86);
                            SteamEvidence.AddModule(facts,known.Name,path,root,system,system32);
                        }
                    }
                    catch(Win32Exception e){facts.ProcessStatus=e.NativeErrorCode==5?ReadStatus.AccessDenied:ReadStatus.Partial;}
                    catch(UnauthorizedAccessException){facts.ProcessStatus=ReadStatus.AccessDenied;}
                    catch(SecurityException){facts.ProcessStatus=ReadStatus.AccessDenied;}
                    catch{facts.ProcessStatus=ReadStatus.Partial;}
                }
                if(!facts.MatchingProcessFound&&facts.ProcessStatus==ReadStatus.Complete)facts.ProcessStatus=ReadStatus.Unavailable;
            }
            catch(UnauthorizedAccessException){facts.ProcessStatus=ReadStatus.AccessDenied;}
            catch{facts.ProcessStatus=ReadStatus.Unavailable;}
            finally{if(processes!=null)foreach(var p in processes)p.Dispose();}
        }
    }
}
