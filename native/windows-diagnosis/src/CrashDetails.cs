using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Gemnao.Diagnostics
{
    public static class CrashDetails
    {
        private static readonly string[] KnownNames = { "ntdll.dll", "kernelbase.dll", "kernel32.dll", "nvwgf2umx.dll", "nvwgf2um.dll", "nvldumdx.dll", "atidxx64.dll", "atidxx32.dll", "amdxx64.dll", "igd10iumd64.dll", "igd12umd64.dll", "dxgi.dll", "d3d11.dll", "d3d12.dll", "vcruntime140.dll", "vcruntime140_1.dll", "msvcp140.dll", "msvcr120.dll", "ucrtbase.dll", "gameoverlayrenderer64.dll", "gameoverlayrenderer.dll" };
        public static int[] VersionParts(string value)
        {
            if(value==null || !Regex.IsMatch(value,@"\A[0-9]{1,5}(\.[0-9]{1,5}){3}\z"))return new int[0];
            var parts=value.Split('.').Select(x=>int.Parse(x,CultureInfo.InvariantCulture)).ToArray();
            return parts.All(x=>x<=65535)?parts:new int[0];
        }
        public static string VersionText(int[] parts) { return ValidVersion(parts)?string.Join(" / ",parts.Select(x=>x.ToString(CultureInfo.InvariantCulture))):L.T("CrashDetails.001"); }
        public static bool ValidVersion(int[] parts) { return parts!=null && parts.Length==4 && parts.All(x=>x>=0 && x<=65535); }
        public static ulong? Offset(string value)
        {
            if(value==null || !Regex.IsMatch(value,@"\A(?:0[xX])?[a-fA-F0-9]{1,16}\z"))return null;
            ulong n; string s=value.StartsWith("0x",StringComparison.OrdinalIgnoreCase)?value.Substring(2):value;
            return ulong.TryParse(s,NumberStyles.AllowHexSpecifier,CultureInfo.InvariantCulture,out n)?(ulong?)n:null;
        }
        public static string OffsetText(ulong? value) { return value.HasValue?"0x"+value.Value.ToString("X16",CultureInfo.InvariantCulture):L.T("CrashDetails.001"); }
        public static string Exception(string value)
        {
            if(value==null || !Regex.IsMatch(value,@"\A(?:0[xX])?[A-Fa-f0-9]{8}\z"))return "";
            return value.Substring(value.Length-8).ToUpperInvariant();
        }
        public static string LocalBasename(string name)
        {
            string n=Rules.FileName(name);
            if(n.Length==0 || n.Length>120 || n.Any(c=>char.IsControl(c)||char.GetUnicodeCategory(c)==UnicodeCategory.Format))return "";
            return n;
        }
        public static string KnownName(string name)
        {
            return KnownNames.FirstOrDefault(x=>string.Equals(name,x,StringComparison.OrdinalIgnoreCase))??"";
        }
        private static string Canonical(string path) { return (path??"").Replace('/','\\').Trim().Trim('"').ToUpperInvariant(); }
        public static void Attach(EventFact e,string target,string module,string modulePath,string appVersion,string moduleVersion,string offset)
        {
            e.LocalModuleName=LocalBasename(module);
            // Windows can put the literal sentinel "unknown" here. It identifies no DLL.
            e.ModuleNameUnavailable=string.IsNullOrWhiteSpace(e.LocalModuleName) ||
                string.Equals(e.LocalModuleName.Trim(),"unknown",StringComparison.OrdinalIgnoreCase);
            e.ModuleIdentityToken="";
            e.AppVersionParts=VersionParts(appVersion); e.ModuleVersionParts=VersionParts(moduleVersion); e.FaultOffset=Offset(offset);
            e.Module=e.ModuleNameUnavailable?ModuleKind.Unknown:Rules.ClassifyModule(module);
            if(!e.ModuleNameUnavailable && string.Equals(e.LocalModuleName,Rules.FileName(target),StringComparison.OrdinalIgnoreCase))
            {
                if(!string.IsNullOrWhiteSpace(modulePath))
                {
                    if(Canonical(modulePath)==Canonical(target)) { e.Module=ModuleKind.TargetExecutable; e.ModuleTargetMatch=MatchKind.ExactPath; }
                }
                else { e.Module=ModuleKind.TargetExecutable; e.ModuleTargetMatch=MatchKind.NameOnly; }
            }
            if(KnownName(e.LocalModuleName).StartsWith("gameoverlayrenderer",StringComparison.Ordinal))e.Module=ModuleKind.SteamOverlay;
            // Internal only: no raw module paths are retained or displayed; digest is never exported.
            if(!e.ModuleNameUnavailable)
            {
                string identity=string.IsNullOrWhiteSpace(modulePath) || string.Equals(modulePath.Trim(),"unknown",StringComparison.OrdinalIgnoreCase)?"NAME:"+e.LocalModuleName.ToUpperInvariant():"PATH:"+Canonical(modulePath);
                using(var sha=SHA256.Create())e.ModuleIdentityToken=Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(identity)));
            }
        }
        public static string ModuleText(EventFact e,bool knownNames=false)
        {
            string type=e.ModuleNameUnavailable?L.T("CrashDetails.002"):e.Module==ModuleKind.TargetExecutable?(e.ModuleTargetMatch==MatchKind.ExactPath?L.T("CrashDetails.003"):L.T("CrashDetails.004")):
                e.Module==ModuleKind.SteamOverlay?L.T("CrashDetails.005"):e.Module==ModuleKind.Graphics?L.T("CrashDetails.006"):e.Module==ModuleKind.VisualCpp?L.T("CrashDetails.007"):e.Module==ModuleKind.WindowsCore?L.T("CrashDetails.008"):e.Module==ModuleKind.Other?L.T("CrashDetails.009"):L.T("CrashDetails.010");
            string name=KnownName(e.LocalModuleName);
            return type+(knownNames && name.Length>0?" ["+name+"]":"");
        }
        public static bool CompleteSignature(EventFact e)
        {
            return e.Kind==EventKind.ApplicationCrash && e.Match==MatchKind.ExactPath && !e.ModuleNameUnavailable && !string.IsNullOrEmpty(e.ModuleIdentityToken) &&
                ValidVersion(e.AppVersionParts) && ValidVersion(e.ModuleVersionParts) && e.FaultOffset.HasValue && Exception(e.ExceptionCode).Length==8;
        }
        private static string Signature(EventFact e)
        {
            return e.ModuleIdentityToken+"|"+VersionText(e.AppVersionParts)+"|"+VersionText(e.ModuleVersionParts)+"|"+Exception(e.ExceptionCode)+"|"+OffsetText(e.FaultOffset);
        }
        public static string PatternReport(Snapshot current,Snapshot baseline,bool knownNames=false)
        {
            var b=new StringBuilder(L.T("CrashDetails.011"));
            var now=current.Application.Events.Where(x=>x.Kind==EventKind.ApplicationCrash).ToArray();
            bool comparable=baseline!=null && baseline!=current && baseline.TargetSession==current.TargetSession && baseline.EndUtc<current.StartUtc && (baseline.AttemptId==Guid.Empty || baseline.AttemptId!=current.AttemptId);
            var before=comparable?baseline.Application.Events.Where(x=>x.Kind==EventKind.ApplicationCrash).ToArray():new EventFact[0];
            var eligible=before.Concat(now).Where(CompleteSignature).ToArray();
            int incomplete=now.Count(x=>!CompleteSignature(x));
            if(eligible.Length==0)b.AppendLine(L.T("CrashDetails.012"));
            int number=0;
            foreach(var group in eligible.GroupBy(Signature))
            {
                var e=group.First(); string key=group.Key;
                b.AppendLine("P"+(++number).ToString("00",CultureInfo.InvariantCulture)+": "+ModuleText(e,knownNames)+L.T("CrashDetails.013")+Exception(e.ExceptionCode)+L.T("CrashDetails.014")+OffsetText(e.FaultOffset));
                b.AppendLine(L.T("CrashDetails.015")+VersionText(e.AppVersionParts)+L.T("CrashDetails.016")+VersionText(e.ModuleVersionParts));
                b.AppendLine(comparable?L.T("CrashDetails.017")+before.Count(x=>CompleteSignature(x)&&Signature(x)==key)+L.T("CrashDetails.018")+now.Count(x=>CompleteSignature(x)&&Signature(x)==key)+L.T("CrashDetails.019"):L.T("CrashDetails.020")+now.Count(x=>CompleteSignature(x)&&Signature(x)==key)+L.T("CrashDetails.019"));
            }
            if(now.Any(x=>x.ModuleNameUnavailable))b.AppendLine(L.T("CrashDetails.021"));
            if(incomplete>0)b.AppendLine(L.T("CrashDetails.022")+incomplete+L.T("CrashDetails.023"));
            b.AppendLine(L.T("CrashDetails.024"));
            b.AppendLine(L.T("CrashDetails.025"));
            if(current.Application.Status!=ReadStatus.Complete || (comparable && baseline.Application.Status!=ReadStatus.Complete))b.AppendLine(L.T("CrashDetails.026"));
            return b.ToString();
        }
        public static string LocalDetails(Snapshot s)
        {
            var b=new StringBuilder(L.T("CrashDetails.027"));
            foreach(var e in s.Application.Events.Where(x=>x.Kind==EventKind.ApplicationCrash).Take(20))
                b.AppendLine(L.T("CrashDetails.028")+(e.LocalModuleName.Length>0?e.LocalModuleName:L.T("CrashDetails.029"))+" / "+ModuleText(e)+L.T("CrashDetails.013")+Exception(e.ExceptionCode)+L.T("CrashDetails.030")+OffsetText(e.FaultOffset)+L.T("CrashDetails.031")+VersionText(e.AppVersionParts)+L.T("CrashDetails.016")+VersionText(e.ModuleVersionParts));
            return b.ToString();
        }
    }
}
