using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Gemnao.Diagnostics
{
    public enum TraceId { DirectInputProxy,DxgiProxy,D3d11Proxy,VersionProxy,ReShadeConfig,ReShadeShaders,ReFrameworkDirectory }
    public enum TraceState { Unknown,Absent,Present,Denied,Unsupported }
    public enum ProductMark { None,ReShade,ReFramework }
    public enum LaunchHistoryKind { Unknown,NoUsefulValue,TimestampValue,Invalid }
    public sealed class TraceDefinition { public TraceId Id;public string Name;public bool Directory,Dll; }
    public sealed class TraceFact { public TraceId Id;public TraceState State;public ProductMark Marker; }
    public static class TraceEvidence
    {
        public static readonly TraceDefinition[] KnownFiles={
            new TraceDefinition{Id=TraceId.DirectInputProxy,Name="dinput8.dll",Dll=true},new TraceDefinition{Id=TraceId.DxgiProxy,Name="dxgi.dll",Dll=true},new TraceDefinition{Id=TraceId.D3d11Proxy,Name="d3d11.dll",Dll=true},new TraceDefinition{Id=TraceId.VersionProxy,Name="version.dll",Dll=true},
            new TraceDefinition{Id=TraceId.ReShadeConfig,Name="ReShade.ini"},new TraceDefinition{Id=TraceId.ReShadeShaders,Name="reshade-shaders",Directory=true},new TraceDefinition{Id=TraceId.ReFrameworkDirectory,Name="reframework",Directory=true}
        };
        public static ProductMark ProductMarker(string product,string description)
        {
            if(new[]{product,description}.Any(x=>string.Equals(x,"ReShade",StringComparison.OrdinalIgnoreCase)))return ProductMark.ReShade;
            if(new[]{product,description}.Any(x=>string.Equals(x,"REFramework",StringComparison.OrdinalIgnoreCase)))return ProductMark.ReFramework;
            return ProductMark.None;
        }
        public static LaunchHistoryKind LaunchHistory(string text,DateTime nowUtc)
        {
            KvNode app;var root=SteamText.Parse(text);
            if(!root.Children.TryGetValue("AppState",out app)||app.Text("appid")!=WildsProfile.AppId)return LaunchHistoryKind.Unknown;
            string value=app.Text("LastPlayed");if(string.IsNullOrEmpty(value)||value=="0")return LaunchHistoryKind.NoUsefulValue;
            ulong seconds;if(!Regex.IsMatch(value,@"\A[0-9]{9,10}\z")||!ulong.TryParse(value,out seconds))return LaunchHistoryKind.Invalid;
            try{var time=new DateTime(1970,1,1,0,0,0,DateTimeKind.Utc).AddSeconds(seconds);return time<=nowUtc.AddDays(1)?LaunchHistoryKind.TimestampValue:LaunchHistoryKind.Invalid;}catch{return LaunchHistoryKind.Invalid;}
        }
        public static bool HasTrace(Snapshot s) { return s.Wilds.Traces.Any(x=>x.State==TraceState.Present); }
        public static string Summary(Snapshot s,WildsAnswers a)
        {
            var b=new StringBuilder(L.T("TraceEvidence.001"));
            b.AppendLine(L.T("TraceEvidence.002")+WildsProfile.AnswerText(a.WorkedBefore)+L.T("TraceEvidence.003")+WildsProfile.AnswerText(a.DemoWorked));
            b.AppendLine(L.T("TraceEvidence.004"));
            b.AppendLine(L.T("TraceEvidence.005")+Rules.StatusText(s.Wilds.TraceStatus));
            foreach(var def in KnownFiles)
            {
                var f=s.Wilds.Traces.FirstOrDefault(x=>x.Id==def.Id);if(f==null)continue;
                string state=f.State==TraceState.Present?L.T("TraceEvidence.006"):f.State==TraceState.Absent?L.T("TraceEvidence.007"):f.State==TraceState.Denied?L.T("TraceEvidence.008"):L.T("TraceEvidence.009");
                string mark=f.Marker==ProductMark.ReShade?L.T("TraceEvidence.010"):f.Marker==ProductMark.ReFramework?L.T("TraceEvidence.011"):"";
                b.AppendLine("  "+def.Name+": "+state+mark);
            }
            b.AppendLine(L.T("TraceEvidence.012"));
            string history=s.Wilds.History==LaunchHistoryKind.TimestampValue?L.T("TraceEvidence.013"):s.Wilds.History==LaunchHistoryKind.NoUsefulValue?L.T("TraceEvidence.014"):L.T("TraceEvidence.015");
            b.AppendLine(L.T("TraceEvidence.016")+history+" / "+Rules.StatusText(s.Wilds.HistoryStatus));
            b.AppendLine(L.T("TraceEvidence.017"));return b.ToString();
        }
    }
}
