using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Gemnao.Diagnostics
{
    public enum Answer { Unknown, No, Yes }
    public enum LaunchStage { ImmediateExit, CrashReporter, ShaderPreparation, GraphicsError, SecurityNotice, Other, UnhandledException }
    public enum VerifyResult { NotDone, Unknown, NoFilesReacquired, FilesReacquired }
    public sealed class WildsAnswers
    {
        public LaunchStage Stage;
        public Answer WorkedBefore;
        public Answer DemoWorked;
        public Answer CaptureTools;
        public Answer Mods;
        public Answer TexturePack;
        public Answer WholePcIssue;
        public VerifyResult Verification;
    }
    public sealed class WildsFacts
    {
        public ReadStatus TraceStatus = ReadStatus.NotRead;
        public readonly List<TraceFact> Traces = new List<TraceFact>();
        public ReadStatus HistoryStatus = ReadStatus.NotRead;
        public LaunchHistoryKind History;
        public ReadStatus FileStatus = ReadStatus.NotRead;
        public int[] GameVersionParts = new int[0];
        public ReadStatus CompatibilityStatus = ReadStatus.NotRead;
        public bool GameCompatibility;
        public bool SteamCompatibility;
        public bool GameAdminFlag;
        public ReadStatus CrashFolderStatus = ReadStatus.NotRead;
        public bool CrashFolderPresent;
        public int CrashFilesExamined;
        public int CrashFilesInWindow;
        public bool CrashLimitReached;
        public ReadStatus InstalledRamStatus = ReadStatus.NotRead;
        public long? InstalledRamMiB;
        public bool? Is64BitWindows;
    }
    public sealed class ActionPlanItem
    {
        public GuideStep Step;
        public string Reason;
    }
    public sealed class SteamEntry
    {
        // Full paths remain local, never exported. Discovery is optional and explicitly consented.
        public string GamePath;
        public string SteamExe;
    }
    public static class WildsProfile
    {
        public const string ExeName = "MonsterHunterWilds.exe";
        public const string AppId = "2246340";
        public const string CheckedOn = "2026-10-02";
        public const string Official = "https://steamcommunity.com/app/2246340/discussions/0/596267902352499417/";
        public const string Guide = "https://gemnao.pages.dev/games/monster-hunter-wilds/not-launching";
        public static string GameVersionText(int[] parts)
        {
            if (parts == null || parts.Length != 4 || parts.Any(x => x < 0 || x > 65535)) return L.T("WildsCore.001");
            return string.Join(" / ", parts.Select(x => x.ToString(CultureInfo.InvariantCulture))) + "（major / minor / build / revision）";
        }
        public static bool IsTarget(string path) { return Rules.IsLocalExe(path) && string.Equals(Rules.FileName(path), ExeName, StringComparison.OrdinalIgnoreCase); }
        public static bool HasCompatibilityFlag(string value)
        {
            return Regex.IsMatch(value ?? "", @"(?:\A|\s)(?:WIN95|WIN98|WIN2000|WINXPSP2|WINXPSP3|VISTARTM|VISTASP1|VISTASP2|WIN7RTM|WIN8RTM)(?:\s|\z)", RegexOptions.IgnoreCase);
        }
        public static bool HasAdminFlag(string value) { return Regex.IsMatch(value ?? "", @"(?:\A|\s)RUNASADMIN(?:\s|\z)", RegexOptions.IgnoreCase); }
        public static GuideStep[] Steps { get { return new GuideStep[] {
            new GuideStep { Id="wilds-steam-client-review", Title=L.T("WildsCore.002"), Instructions=L.T("WildsCore.003"), Warning=L.T("WildsCore.004"), GuideUrl=Guide, OfficialUrl=Official },
            new GuideStep { Id="wilds-stop", Title=L.T("WildsCore.005"), Instructions=L.T("WildsCore.006"), Warning=L.T("WildsCore.007"), GuideUrl=Guide, OfficialUrl="https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart" },
            new GuideStep { Id="wilds-security", Title=L.T("WildsCore.008"), Instructions=L.T("WildsCore.009"), Warning=L.T("WildsCore.010"), GuideUrl=Guide+"#security", OfficialUrl="https://support.microsoft.com/en-us/windows/security/windows-security/protection-history-in-the-windows-security-app" },
            new GuideStep { Id="wilds-compatibility", Title=L.T("WildsCore.011"), Instructions=L.T("WildsCore.012"), Warning=L.T("WildsCore.013"), GuideUrl=Guide, OfficialUrl=Official },
            new GuideStep { Id="wilds-admin-flag", Title=L.T("WildsCore.014"), Instructions=L.T("WildsCore.015"), Warning=L.T("WildsCore.016"), GuideUrl=Guide, OfficialUrl=Official },
            new GuideStep { Id="wilds-mods", Title=L.T("WildsCore.017"), Instructions=L.T("WildsCore.018"), Warning=L.T("WildsCore.019"), GuideUrl=Guide+"#remove-mods", OfficialUrl=Official },
            new GuideStep { Id="wilds-capture", Title=L.T("WildsCore.020"), Instructions=L.T("WildsCore.021"), Warning=L.T("WildsCore.022"), GuideUrl=Guide+"#remove-mods", OfficialUrl="https://obsproject.com/kb/game-capture-source" },
            new GuideStep { Id="wilds-traces", Title=L.T("WildsCore.023"), Instructions=L.T("WildsCore.024"), Warning=L.T("WildsCore.025"), GuideUrl=Guide+"#remove-mods", OfficialUrl=Official },
            new GuideStep { Id="wilds-files", Title=L.T("WildsCore.026"), Instructions=L.T("WildsCore.027"), Warning=L.T("WildsCore.028"), GuideUrl=Guide+"#verify-files", OfficialUrl="https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB" },
            new GuideStep { Id="wilds-textures", Title=L.T("WildsCore.029"), Instructions=L.T("WildsCore.030"), Warning=L.T("WildsCore.031"), GuideUrl=Guide+"#check-vram", OfficialUrl=Official },
            new GuideStep { Id="wilds-driver", Title=L.T("WildsCore.032"), Instructions=L.T("WildsCore.033"), Warning=L.T("WildsCore.034"), GuideUrl=Guide+"#update-driver", OfficialUrl="https://store.steampowered.com/news/app/2246340/view/534357354429284375" },
            new GuideStep { Id="wilds-requirements", Title=L.T("WildsCore.035"), Instructions=L.T("WildsCore.036"), Warning=L.T("WildsCore.037"), GuideUrl="https://gemnao.pages.dev/games/monster-hunter-wilds/system-requirements", OfficialUrl="https://store.steampowered.com/app/2246340/" },
            new GuideStep { Id="wilds-records", Title=L.T("WildsCore.038"), Instructions=L.T("WildsCore.039"), Warning=L.T("WildsCore.040"), GuideUrl=Guide+"#crash-record", OfficialUrl="https://www.monsterhunter.com/support/wilds/" }
        }; } }
        public static bool AcceptsCapture(Snapshot captured, Guid expectedTarget, bool cancelled)
        {
            return !cancelled && captured != null && expectedTarget != Guid.Empty && captured.TargetSession == expectedTarget;
        }
        public static int NextUntried(IList<ActionPlanItem> plan, IDictionary<string, StepState> states)
        {
            if (plan.Count > 0 && plan[0].Step.Id == "wilds-stop") return 0;
            for (int i=0; i<plan.Count; i++)
            {
                StepState state;
                if (!states.TryGetValue(plan[i].Step.Id, out state) || state == StepState.NotStarted || state == StepState.Checked) return i;
            }
            return -1;
        }
        public static bool MayRetest(Snapshot s, WildsAnswers a)
        {
            return a.WholePcIssue != Answer.Yes && (s == null || (!s.PriorRestartObserved && !s.System.Events.Any(e => e.Kind == EventKind.UncleanRestart)));
        }
        public static List<ActionPlanItem> Plan(Snapshot s, WildsAnswers a)
        {
            var plan = new List<ActionPlanItem>();
            Action<string, string> add = (id, reason) => { if (!plan.Any(x => x.Step.Id == id)) plan.Add(new ActionPlanItem { Step = Steps.First(x => x.Id == id), Reason = reason }); };
            if (a.WholePcIssue == Answer.Yes || s.PriorRestartObserved || s.System.Events.Any(e => e.Kind == EventKind.UncleanRestart))
            { add("wilds-stop", L.T("WildsCore.041")); add("wilds-records", L.T("WildsCore.042")); return plan; }
            if (SteamEvidence.NeedsReview(s.Steam)) add("wilds-steam-client-review", s.Steam.Modules.Any(x=>x.Location==ModuleLocation.SteamRoot)?L.T("WildsCore.043"):L.T("WildsCore.044"));
            if (a.Stage == LaunchStage.SecurityNotice) add("wilds-security", L.T("WildsCore.045"));
            if(s.Wilds.GameAdminFlag) add("wilds-admin-flag", L.T("WildsCore.046"));
            if (s.Wilds.GameCompatibility || s.Wilds.SteamCompatibility) add("wilds-compatibility", L.T("WildsCore.047"));
            if (a.CaptureTools == Answer.Yes) add("wilds-capture", L.T("WildsCore.048"));
            if (TraceEvidence.HasTrace(s)) add("wilds-traces", L.T("WildsCore.049"));
            if (a.Mods == Answer.Yes) add("wilds-mods", L.T("WildsCore.050"));
            if (s.Wilds.Is64BitWindows == false || (s.Wilds.InstalledRamMiB.HasValue && s.Wilds.InstalledRamMiB < 16384)) add("wilds-requirements", L.T("WildsCore.051"));
            if (a.Verification == VerifyResult.NotDone || a.Verification == VerifyResult.Unknown) add("wilds-files", L.T("WildsCore.052"));
            if (a.TexturePack == Answer.Yes) add("wilds-textures", L.T("WildsCore.053"));
            if (a.Stage == LaunchStage.GraphicsError || a.Stage == LaunchStage.ShaderPreparation || s.Application.Events.Any(e => e.Module == ModuleKind.Graphics) || s.System.Events.Any(e => e.Kind == EventKind.DisplayRecovery)) add("wilds-driver", L.T("WildsCore.054"));
            if (a.TexturePack == Answer.Unknown) add("wilds-textures", L.T("WildsCore.055"));
            if (a.Mods == Answer.Unknown && s.Wilds.TraceStatus != ReadStatus.Complete) add("wilds-mods", L.T("WildsCore.056"));
            add("wilds-driver", L.T("WildsCore.057"));
            add("wilds-records", L.T("WildsCore.058"));
            return plan;
        }
        public static string Summary(Snapshot s, WildsAnswers a, IDictionary<string, StepState> states)
        {
            var b = new StringBuilder();
            b.AppendLine(L.T("WildsCore.059"));
            b.AppendLine(L.T("WildsCore.060") + CheckedOn + L.T("WildsCore.061"));
            b.AppendLine(L.T("WildsCore.062") + StageText(a.Stage) + L.T("WildsCore.063") + AnswerText(a.WorkedBefore));
            b.AppendLine(L.T("WildsCore.064") + AnswerText(a.CaptureTools));
            b.AppendLine(L.T("WildsCore.065") + AnswerText(a.Mods) + L.T("WildsCore.066") + AnswerText(a.TexturePack) + L.T("WildsCore.067") + AnswerText(a.WholePcIssue));
            b.AppendLine(L.T("WildsCore.068") + VerifyText(a.Verification));
            var f = s.Wilds;
            b.AppendLine(L.T("WildsCore.069"));
            b.AppendLine(L.T("WildsCore.070") + GameVersionText(f.GameVersionParts) + " / " + Rules.StatusText(f.FileStatus) + L.T("WildsCore.071"));
            b.AppendLine("64-bit Windows: " + (!f.Is64BitWindows.HasValue ? L.T("WildsCore.072") : f.Is64BitWindows.Value ? L.T("WildsCore.073") : L.T("WildsCore.074")));
            b.AppendLine(L.T("WildsCore.075") + (f.InstalledRamMiB.HasValue ? f.InstalledRamMiB.Value.ToString(CultureInfo.InvariantCulture) + " MiB" : L.T("WildsCore.001")) + " / " + Rules.StatusText(f.InstalledRamStatus));
            b.AppendLine(L.T("WildsCore.076") + Flag(f.GameCompatibility, f.CompatibilityStatus) + " / Steam " + Flag(f.SteamCompatibility, f.CompatibilityStatus) + " / " + Rules.StatusText(f.CompatibilityStatus));
            if (f.GameAdminFlag) b.AppendLine(L.T("WildsCore.077"));
            b.AppendLine("CrashReport: " + (f.CrashFolderStatus != ReadStatus.Complete && f.CrashFolderStatus != ReadStatus.Partial ? L.T("WildsCore.078") : f.CrashFolderPresent ? L.T("WildsCore.079") : L.T("WildsCore.080")) + " / " + Rules.StatusText(f.CrashFolderStatus));
            b.AppendLine(L.T("WildsCore.081") + f.CrashFilesInWindow + L.T("WildsCore.082") + f.CrashFilesExamined + L.T("WildsCore.083") + (f.CrashLimitReached ? L.T("WildsCore.084") : "") + L.T("WildsCore.085"));
            b.AppendLine(L.T("WildsCore.086"));
            b.AppendLine(L.T("WildsCore.087"));
            int n = 1;
            foreach (var item in Plan(s, a))
            {
                StepState state; if (states == null || !states.TryGetValue(item.Step.Id, out state)) state = StepState.NotStarted;
                b.AppendLine((n++) + ". " + item.Step.Title + " [" + Rules.StateText(state) + L.T("WildsCore.088") + item.Reason + "\n" + item.Step.Instructions + L.T("WildsCore.089") + item.Step.Warning + L.T("WildsCore.090") + item.Step.OfficialUrl + "\n");
            }
            b.AppendLine(L.T("WildsCore.091"));
            return b.ToString();
        }
        private static string Flag(bool value, ReadStatus status) { return value ? L.T("WildsCore.092") : status == ReadStatus.Complete ? L.T("WildsCore.093") : L.T("WildsCore.094"); }
        public static string AnswerText(Answer a) { return a == Answer.Yes ? L.T("WildsCore.095") : a == Answer.No ? L.T("WildsCore.096") : L.T("WildsCore.097"); }
        public static string StageText(LaunchStage a)
        {
            switch(a) { case LaunchStage.UnhandledException: return L.T("WildsCore.098"); case LaunchStage.CrashReporter: return L.T("WildsCore.099"); case LaunchStage.ShaderPreparation: return L.T("WildsCore.100"); case LaunchStage.GraphicsError: return L.T("WildsCore.101"); case LaunchStage.SecurityNotice: return L.T("WildsCore.102"); case LaunchStage.Other: return L.T("WildsCore.103"); default: return L.T("WildsCore.104"); }
        }
        public static string VerifyText(VerifyResult a)
        {
            switch(a) { case VerifyResult.Unknown: return L.T("WildsCore.105"); case VerifyResult.NoFilesReacquired: return L.T("WildsCore.106"); case VerifyResult.FilesReacquired: return L.T("WildsCore.107"); default: return L.T("WildsCore.108"); }
        }
    }
    // Valve KeyValues-style syntax: closed, bounded parser for local Steam registration files.
    // Unknown/unsupported syntax fails closed; no macros, file includes, expression evaluation or code.
    public sealed class KvNode
    {
        public string Value;
        public readonly Dictionary<string, KvNode> Children = new Dictionary<string, KvNode>(StringComparer.OrdinalIgnoreCase);
        public string Text(string key) { KvNode n; return Children.TryGetValue(key, out n) ? n.Value : null; }
    }
    public static class SteamText
    {
        public static KvNode Parse(string text)
        {
            if (text == null || text.Length > 1048576) throw new FormatException("Registration file too large.");
            int pos=0, tokens=0;
            Func<string> token = () => {
                while(pos<text.Length) {
                    if(char.IsWhiteSpace(text[pos])) { pos++; continue; }
                    if(text[pos]=='/' && pos+1<text.Length && text[pos+1]=='/') { while(pos<text.Length && text[pos]!='\n')pos++; continue; }
                    break;
                }
                if(pos>=text.Length)return null;
                if(++tokens>8192)throw new FormatException("Too many tokens.");
                char c=text[pos++]; if(c=='{' || c=='}')return c.ToString();
                if(c!='"')throw new FormatException("Unsupported token.");
                var b=new StringBuilder();
                while(pos<text.Length) {
                    c=text[pos++]; if(c=='"')return "s:"+b;
                    if(c=='\\') { if(pos>=text.Length)throw new FormatException(); char next=text[pos++]; if(next=='\\' || next=='"')b.Append(next); else throw new FormatException("Unsupported escape."); }
                    else { if(char.IsControl(c))throw new FormatException(); b.Append(c); }
                    if(b.Length>4096)throw new FormatException("String too long.");
                }
                throw new FormatException("Unclosed string.");
            };
            Func<int,bool,KvNode> read=null;
            read=(depth,nested)=> {
                if(depth>8)throw new FormatException("Too deep.");
                var node=new KvNode();
                for(;;) {
                    string key=token(); if(key==null) { if(nested)throw new FormatException(); return node; }
                    if(key=="}") { if(!nested)throw new FormatException(); return node; }
                    if(!key.StartsWith("s:"))throw new FormatException();
                    string value=token(); if(value==null)throw new FormatException();
                    KvNode child;
                    if(value=="{")child=read(depth+1,true);
                    else if(value.StartsWith("s:"))child=new KvNode { Value=value.Substring(2) };
                    else throw new FormatException();
                    key=key.Substring(2); if(node.Children.ContainsKey(key))throw new FormatException("Duplicate key.");
                    node.Children.Add(key,child);
                }
            };
            return read(0,false);
        }
        public static string[] LibraryPaths(string text)
        {
            var root=Parse(text); KvNode libs;
            if(!root.Children.TryGetValue("libraryfolders",out libs))return new string[0];
            return libs.Children.Where(x=>Regex.IsMatch(x.Key,@"\A[0-9]{1,3}\z")).Select(x=>x.Value.Value ?? x.Value.Text("path"))
                .Where(IsLocalDirectory).Distinct(StringComparer.OrdinalIgnoreCase).Take(16).ToArray();
        }
        public static string NormalizeLocalPath(string path)
        {
            if (!IsLocalDirectory(path)) return null;
            return char.ToUpperInvariant(path[0]) + path.Substring(1).Replace('/', '\\');
        }
        public static bool IsLocalDirectory(string path)
        {
            if(path==null || path.Length>240 || !Regex.IsMatch(path,@"\A[A-Za-z]:[\\/]"))return false;
            if(path.Substring(3).IndexOfAny(new[]{':','\0','*','?','"','<','>','|'})>=0 || path.Any(char.IsControl))return false;
            return !path.Replace('/','\\').Split('\\').Any(x=>x==".." || x==".");
        }
        public static string InstallDirectory(string text)
        {
            var root=Parse(text); KvNode app;
            if(!root.Children.TryGetValue("AppState",out app) || app.Text("appid")!=WildsProfile.AppId)return null;
            string name=app.Text("installdir");
            if(string.IsNullOrWhiteSpace(name) || name.Length>120 || name=="." || name==".." || name.EndsWith(".") || name.EndsWith(" ") || name.IndexOfAny(new[]{'\\','/',':','\0','*','?','"','<','>','|'})>=0 || name.Any(char.IsControl))return null;
            return name;
        }
    }
}
