using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Gemnao.Diagnostics
{
    public enum SteamItemId { OpenSteamTool, CloudRedirect, Dwmapi, Xinput14, LocalDwmapi, ToolConfig }
    public enum ModuleLocation { Unknown, SteamRoot, WindowsSystem, Other }
    public enum SteamObservation { Unknown, RootModuleObserved, KnownSystemOnly, KnownModulesNotListed }
    public sealed class SteamItemDefinition { public SteamItemId Id; public string Name; public bool Module; }
    public sealed class SteamFileFact { public SteamItemId Id; public TraceState State; public bool Hidden; }
    public sealed class SteamModuleFact { public SteamItemId Id; public ModuleLocation Location; }
    public sealed class SteamModuleContext
    {
        // Transient comparison context only; never attached to an export or saved history.
        public string SteamRoot,WindowsSystem,WindowsX86;
    }
    public sealed class SteamFacts
    {
        public ReadStatus FileStatus=ReadStatus.NotRead, ProcessStatus=ReadStatus.NotRead;
        public bool RootSelected, MatchingProcessFound, ProcessLimitReached, ModuleLimitReached;
        public readonly List<SteamFileFact> Files=new List<SteamFileFact>();
        public readonly List<SteamModuleFact> Modules=new List<SteamModuleFact>();
    }
    public static class SteamEvidence
    {
        public static readonly SteamItemDefinition[] Items={
            new SteamItemDefinition{Id=SteamItemId.OpenSteamTool,Name="OpenSteamTool.dll",Module=true},
            new SteamItemDefinition{Id=SteamItemId.CloudRedirect,Name="cloud_redirect.dll",Module=true},
            new SteamItemDefinition{Id=SteamItemId.Dwmapi,Name="dwmapi.dll",Module=true},
            new SteamItemDefinition{Id=SteamItemId.Xinput14,Name="xinput1_4.dll",Module=true},
            new SteamItemDefinition{Id=SteamItemId.LocalDwmapi,Name="localdwmapi.dll",Module=true},
            new SteamItemDefinition{Id=SteamItemId.ToolConfig,Name="opensteamtool.toml"}
        };
        public static SteamItemDefinition Known(string name) { return Items.FirstOrDefault(x=>string.Equals(x.Name,name,StringComparison.OrdinalIgnoreCase)); }
        private static string Full(string path)
        {
            if(!SteamText.IsLocalDirectory(path))return null;
            return SteamText.NormalizeLocalPath(path)?.TrimEnd('\\').ToUpperInvariant();
        }
        public static ModuleLocation ClassifyLocation(string fullModulePath,string steamRoot,string windowsSystem,string windowsSystem32)
        {
            string p=Full(fullModulePath),root=Full(steamRoot),system=Full(windowsSystem),system32=Full(windowsSystem32);
            if(p==null||(root==null&&system==null&&system32==null))return ModuleLocation.Unknown;
            int split=p.LastIndexOf('\\');if(split<3)return ModuleLocation.Unknown;
            string parent=p.Substring(0,split);
            if(root!=null && parent==root)return ModuleLocation.SteamRoot;
            if((system!=null&&parent==system)||(system32!=null&&parent==system32))return ModuleLocation.WindowsSystem;
            return ModuleLocation.Other;
        }
        public static void AddModule(SteamFacts facts,string name,string path,string steamRoot,string system,string system32)
        {
            var def=Known(name);if(def==null||!def.Module)return;
            var location=ClassifyLocation(path,steamRoot,system,system32);
            if(!facts.Modules.Any(x=>x.Id==def.Id&&x.Location==location))facts.Modules.Add(new SteamModuleFact{Id=def.Id,Location=location});
        }
        public static SteamObservation Observation(SteamFacts facts)
        {
            if(facts.Modules.Any(x=>x.Location==ModuleLocation.SteamRoot))return SteamObservation.RootModuleObserved;
            if(facts.ProcessStatus!=ReadStatus.Complete||!facts.MatchingProcessFound||facts.ProcessLimitReached||facts.ModuleLimitReached)return SteamObservation.Unknown;
            if(facts.Modules.Any(x=>x.Location==ModuleLocation.Other||x.Location==ModuleLocation.Unknown))return SteamObservation.Unknown;
            return facts.Modules.Count>0?SteamObservation.KnownSystemOnly:SteamObservation.KnownModulesNotListed;
        }
        public static bool NeedsReview(SteamFacts facts) { return facts.Files.Any(x=>x.State==TraceState.Present)||facts.Modules.Any(x=>x.Location==ModuleLocation.SteamRoot); }
        public static string LocationText(ModuleLocation location)
        {
            return location==ModuleLocation.SteamRoot?L.T("SteamEvidence.001"):location==ModuleLocation.WindowsSystem?L.T("SteamEvidence.002"):location==ModuleLocation.Other?L.T("SteamEvidence.003"):L.T("SteamEvidence.004");
        }
        public static string ObservationText(SteamObservation observation)
        {
            return observation==SteamObservation.RootModuleObserved?L.T("SteamEvidence.005"):observation==SteamObservation.KnownSystemOnly?L.T("SteamEvidence.006"):observation==SteamObservation.KnownModulesNotListed?L.T("SteamEvidence.007"):L.T("SteamEvidence.008");
        }
        public static string Summary(SteamFacts facts)
        {
            var b=new StringBuilder(L.T("SteamEvidence.009"));
            b.AppendLine(L.T("SteamEvidence.010")+Rules.StatusText(facts.FileStatus));
            foreach(var f in facts.Files)
            {
                var d=Items.FirstOrDefault(x=>x.Id==f.Id);if(d==null)continue;
                b.AppendLine("  "+d.Name+": "+(f.State==TraceState.Present?L.T("SteamEvidence.011")+(f.Hidden?L.T("SteamEvidence.012"):L.T("SteamEvidence.013")):f.State==TraceState.Absent?L.T("SteamEvidence.014"):f.State==TraceState.Denied?L.T("SteamEvidence.015"):L.T("SteamEvidence.016")));
            }
            b.AppendLine(L.T("SteamEvidence.017")+Rules.StatusText(facts.ProcessStatus));
            foreach(var m in facts.Modules)
            {
                var d=Items.FirstOrDefault(x=>x.Id==m.Id);if(d==null||!d.Module)continue;
                b.AppendLine("  "+d.Name+L.T("SteamEvidence.018")+LocationText(m.Location));
            }
            b.AppendLine(ObservationText(Observation(facts)));
            b.AppendLine(L.T("SteamEvidence.019"));
            b.AppendLine(L.T("SteamEvidence.020"));
            return b.ToString();
        }
    }
}
