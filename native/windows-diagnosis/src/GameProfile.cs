using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Gemnao.Diagnostics
{
    public enum GameKind { General, Wilds }
    public enum GameSymptom { Launch, Crash, BlackScreen, Freeze, LowFps, Stutter, Other }
    public enum GameStore { Unknown, Steam, Other }
    public enum GameScene { Unknown, Startup, Menu, Gameplay, Everywhere }
    public enum Frequency { Unknown, Always, Sometimes }
    public enum GraphicsTrial { Unrecorded, NotTried, Better, Same, Worse, Unsure }
    public sealed class GameAnswers
    {
        public GameSymptom Symptom;
        public GameStore Store;
        public GameScene Scene;
        public Frequency Frequency;
        public GraphicsTrial LowerGraphics;
        public WildsAnswers Shared = new WildsAnswers();
    }
    public static class GameProfile
    {
        public const string Guide="https://gemnao.pages.dev/guide/pc-game-crash";
        public const string PerformanceOfficial="https://support.microsoft.com/en-us/windows/experience/performance-optimization/tips-to-improve-pc-performance-in-windows";
        public static string[] SymptomLabels { get { return new[] {L.T("GameProfile.001"),L.T("GameProfile.002"),L.T("GameProfile.003"),L.T("GameProfile.004"),L.T("GameProfile.005"),L.T("GameProfile.006"),L.T("GameProfile.007")}; } }
        public static string[] SceneLabels { get { return new[] {L.T("GameProfile.008"),L.T("GameProfile.009"),L.T("GameProfile.010"),L.T("GameProfile.011"),L.T("GameProfile.012")}; } }
        public static string[] FrequencyLabels { get { return new[] {L.T("GameProfile.008"),L.T("GameProfile.013"),L.T("GameProfile.014")}; } }
        public static string[] GraphicsTrialLabels { get { return new[] {L.T("GameProfile.015"),L.T("GameProfile.016"),L.T("GameProfile.017"),L.T("GameProfile.018"),L.T("GameProfile.019"),L.T("GameProfile.020")}; } }
        public static string Name(GameKind kind){return kind==GameKind.Wilds?L.T("GameProfile.021"):L.T("GameProfile.022");}
        public static string SymptomText(GameSymptom symptom){return Enum.IsDefined(typeof(GameSymptom),symptom)?SymptomLabels[(int)symptom]:L.T("GameProfile.008");}
        public static bool Accepts(string path,GameKind kind){return Enum.IsDefined(typeof(GameKind),kind)&&Rules.IsLocalExe(path)&&SteamText.IsLocalDirectory(path)&&(kind!=GameKind.Wilds||WildsProfile.IsTarget(path));}
        public static bool UsesWildsRules(GameKind kind,GameSymptom symptom){return kind==GameKind.Wilds&&symptom==GameSymptom.Launch;}
        public static bool IsPerformance(GameSymptom symptom){return symptom==GameSymptom.LowFps||symptom==GameSymptom.Stutter;}
        private static GuideStep Copy(string id,string title,string instructions,string warning,string official)
        {return new GuideStep{Id=id,Title=title,Instructions=instructions,Warning=warning,GuideUrl=Guide,OfficialUrl=official};}
        public static GuideStep[] Steps { get { return Rules.Steps.Concat(new[]{
            Copy("game-context",L.T("GameProfile.023"),L.T("GameProfile.024"),L.T("GameProfile.025"),Rules.Steps[0].OfficialUrl),
            Copy("game-black-screen",L.T("GameProfile.026"),L.T("GameProfile.027"),L.T("GameProfile.028"),Rules.Steps[2].OfficialUrl),
            Copy("game-freeze",L.T("GameProfile.029"),L.T("GameProfile.030"),L.T("GameProfile.031"),PerformanceOfficial),
            Copy("game-performance",L.T("GameProfile.032"),L.T("GameProfile.033"),L.T("GameProfile.034"),PerformanceOfficial),
            Copy("game-stutter",L.T("GameProfile.035"),L.T("GameProfile.036"),L.T("GameProfile.037"),PerformanceOfficial),
            Copy("game-capture",L.T("GameProfile.038"),L.T("GameProfile.039"),L.T("GameProfile.040"), "https://help.steampowered.com/en/faqs/view/3978-072C-18DF-FBF9"),
            Copy("game-mods",L.T("GameProfile.041"),L.T("GameProfile.042"),L.T("GameProfile.043"),Rules.Steps[0].OfficialUrl),
            Copy("game-compatibility",L.T("GameProfile.044"),L.T("GameProfile.045"),L.T("GameProfile.046"),Rules.Steps[0].OfficialUrl),
            Copy("game-steam-client",L.T("GameProfile.047"),L.T("GameProfile.048"),L.T("GameProfile.049"),Rules.Steps[0].OfficialUrl),
            Copy("game-records",L.T("GameProfile.050"),L.T("GameProfile.051"),L.T("GameProfile.052"),Rules.Steps[0].OfficialUrl)
        }).ToArray(); } }
        public static GuideStep[] Catalog(GameKind kind,GameSymptom symptom){return UsesWildsRules(kind,symptom)?WildsProfile.Steps:Steps;}
        public static GuideStep[] AllSteps { get { return Steps.Concat(WildsProfile.Steps).ToArray(); } }
        public static List<ActionPlanItem> Plan(Snapshot s,GameAnswers a)
        {
            if(UsesWildsRules(s.Game,a.Symptom))return WildsProfile.Plan(s,a.Shared);
            var plan=new List<ActionPlanItem>();
            Action<string,string> add=(id,why)=>{if(!plan.Any(x=>x.Step.Id==id))plan.Add(new ActionPlanItem{Step=Steps.First(x=>x.Id==id),Reason=why});};
            if(!WildsProfile.MayRetest(s,a.Shared)){add("stop",L.T("GameProfile.053"));add("game-records",L.T("GameProfile.054"));return plan;}
            if(a.Symptom==GameSymptom.Other){add("game-context",L.T("GameProfile.055"));add("game-records",L.T("GameProfile.056"));return plan;}
            if(a.Symptom==GameSymptom.BlackScreen)add("game-black-screen",L.T("GameProfile.057"));
            if(a.Symptom==GameSymptom.Freeze)add("game-freeze",L.T("GameProfile.058"));
            if(IsPerformance(a.Symptom))
            {
                if(a.Symptom==GameSymptom.Stutter)add("game-stutter",L.T("GameProfile.059"));
                if(a.LowerGraphics==GraphicsTrial.Unrecorded||a.LowerGraphics==GraphicsTrial.NotTried)add("game-performance",L.T("GameProfile.060"));
                else add("game-context",L.T("GameProfile.061"));
            }
            foreach(var finding in Rules.Analyze(s))
            {
                if(finding.StepId=="observe")continue;
                if(finding.StepId=="files"&&a.Store!=GameStore.Steam)continue;
                add(finding.StepId,finding.Evidence+" "+finding.Unknown);
            }
            if(a.Store==GameStore.Steam&&(s.Steam.Files.Any(x=>x.State==TraceState.Present)||s.Steam.Modules.Any(x=>x.Location==ModuleLocation.SteamRoot)))add("game-steam-client",L.T("GameProfile.062"));
            if(a.Shared.CaptureTools==Answer.Yes)add("game-capture",L.T("GameProfile.063"));
            if(a.Shared.Mods==Answer.Yes)add("game-mods",L.T("GameProfile.064"));
            if(s.Wilds.GameCompatibility||s.Wilds.GameAdminFlag)add("game-compatibility",L.T("GameProfile.065"));
            if(a.Store==GameStore.Steam&&(a.Shared.Verification==VerifyResult.NotDone||a.Shared.Verification==VerifyResult.Unknown)&&!IsPerformance(a.Symptom))add("files",L.T("GameProfile.066"));
            if(a.Symptom==GameSymptom.BlackScreen||IsPerformance(a.Symptom))add("graphics",L.T("GameProfile.067"));
            add("game-context",L.T("GameProfile.068"));add("game-records",L.T("GameProfile.069"));return plan;
        }
        public static string Summary(Snapshot s,GameAnswers a,IDictionary<string,StepState> states)
        {
            var b=new StringBuilder(L.T("GameProfile.070"));b.AppendLine(L.T("GameProfile.071")+Name(s.Game)+L.T("GameProfile.072")+SymptomText(a.Symptom));
            b.AppendLine(L.T("GameProfile.073")+(a.Store==GameStore.Steam?"Steam":a.Store==GameStore.Other?L.T("GameProfile.074"):L.T("GameProfile.008"))+L.T("GameProfile.075")+SceneLabels[(int)a.Scene]+L.T("GameProfile.076")+FrequencyLabels[(int)a.Frequency]);
            b.AppendLine(L.T("GameProfile.077")+WildsProfile.AnswerText(a.Shared.WorkedBefore)+L.T("GameProfile.078")+WildsProfile.AnswerText(a.Shared.CaptureTools)+L.T("GameProfile.ModLabel")+WildsProfile.AnswerText(a.Shared.Mods));
            if(IsPerformance(a.Symptom))b.AppendLine(L.T("GameProfile.079")+GraphicsTrialLabels[(int)a.LowerGraphics]+L.T("GameProfile.080"));
            if(UsesWildsRules(s.Game,a.Symptom))return b.Append(WildsProfile.Summary(s,a.Shared,states)).ToString();
            b.AppendLine(L.T("GameProfile.081")+WildsProfile.GameVersionText(s.Wilds.GameVersionParts)+" / "+Rules.StatusText(s.Wilds.FileStatus));
            b.AppendLine(L.T("GameProfile.082")+Rules.StatusText(s.Wilds.CompatibilityStatus)+L.T("GameProfile.083")+(s.Wilds.GameCompatibility?L.T("GameProfile.084"):L.T("GameProfile.085"))+L.T("GameProfile.086")+(s.Wilds.GameAdminFlag?L.T("GameProfile.084"):L.T("GameProfile.085")));
            b.AppendLine(L.T("GameProfile.087")+WildsProfile.AnswerText(a.Shared.WholePcIssue)+L.T("GameProfile.088")+WildsProfile.VerifyText(a.Shared.Verification));
            foreach(var item in Plan(s,a)){StepState state;if(states==null||!states.TryGetValue(item.Step.Id,out state))state=StepState.NotStarted;b.AppendLine("\n["+Rules.StateText(state)+"] "+item.Step.Title+L.T("GameProfile.089")+item.Reason+"\n"+item.Step.Instructions+L.T("GameProfile.090")+item.Step.Warning+L.T("GameProfile.091")+item.Step.OfficialUrl);}
            b.AppendLine(L.T("GameProfile.092"));return b.ToString();
        }
    }
}
