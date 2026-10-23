using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using Gemnao.Diagnostics;

internal static class LocalizationTests
{
    private static void Assert(bool value,string message="Assertion failed") { if(!value)throw new Exception(message); }
    private static bool HasJapanese(string value) { return Regex.IsMatch(value ?? "", "[\\u3040-\\u30ff\\u3400-\\u9fff]"); }
    private static readonly DateTime End=new DateTime(2026,10,2,12,0,0,DateTimeKind.Utc);
    private static Snapshot Sample(GameKind game,GameSymptom symptom)
    {
        var s=new Snapshot{Game=game,Symptom=symptom,TargetSession=Guid.NewGuid(),AttemptId=Guid.NewGuid(),StartUtc=End.AddMinutes(-10),EndUtc=End,CollectedUtc=End};
        s.Application.Status=ReadStatus.Partial;s.System.Status=ReadStatus.AccessDenied;
        s.Hardware.LocalCpuName="Original 日本語 CPU";s.Hardware.LocalGpuNames.Add("Original 日本語 GPU");
        s.Hardware.Gpus.Add(new GpuFact{Vendor="NVIDIA",DriverVersion="32.0.15.7283"});
        s.Hardware.Disks.Add(new DiskFact{FreeMiB=100,TotalMiB=100000,IsSystem=true});s.Hardware.FreeMemoryMiB=100;
        foreach(ModuleKind module in Enum.GetValues(typeof(ModuleKind)))s.Application.Events.Add(new EventFact{Kind=EventKind.ApplicationCrash,Match=MatchKind.ExactPath,Module=module,TimeUtc=End.AddMinutes(-1),ExceptionCode="C0000005"});
        return s;
    }
    public static void Run(Action<string,Action> test)
    {
        test("language defaults ja regional and en safe fallback",()=>{
            Assert(L.ResolveLanguage("ja-JP")=="ja"&&L.ResolveLanguage("JA-jp")=="ja"&&L.ResolveLanguage("ja")=="ja");
            foreach(string name in new[]{"en-US","en-GB","fr-FR","zh-CN","jaevil","",null})Assert(L.ResolveLanguage(name)=="en");
        });
        test("every resource has real English and Japanese without English Japanese leakage",()=>{
            Assert(L.Keys.Count()>=690);
            foreach(string key in L.Keys){Assert(L.HasExactResource(key,"en")&&L.HasExactResource(key,"ja"),key);Assert(!string.IsNullOrWhiteSpace(L.Text(key,"en")),key);Assert(!HasJapanese(L.Text(key,"en")),"Japanese in "+key);}
        });
        test("unsupported culture falls back to English and missing key is visible",()=>{
            L.SetLanguage("fr-FR");Assert(L.Language=="en"&&L.T("Core.001")=="Unknown");Assert(L.T("does.not.exist")=="[does.not.exist]");
        });
        test("fixed choice translation preserves original raw value",()=>{
            L.SetLanguage("en");Assert(L.TranslateUiText(L.Text("MainForm.013","ja"),"ja")==L.Text("MainForm.013","en"));Assert(L.OriginalValue("名前のDLL.dll")=="名前のDLL.dll");
        });
        test("language switch does not change process numeric culture",()=>{var culture=CultureInfo.CurrentCulture;L.SetLanguage("ja");L.SetLanguage("en");Assert(Equals(culture,CultureInfo.CurrentCulture));});
        foreach(string language in new[]{"ja","en"})
        {
            string lang=language;
            test("language "+lang+" numeric unknowns remain typed and excluded",()=>{
                L.SetLanguage(lang);
                foreach(string invalid in new[]{null,"","unknown","不明","32.secret.1","alice@example.com","192.168.1.123","1234567890123.1"})Assert(Rules.NumericVersionValue(invalid)==null,"Accepted "+invalid);
                Assert(Rules.NumericVersionValue("32.0.15.7283")=="32.0.15.7283");Assert(Rules.NumericVersion(null)==L.T("Core.001"));Assert(Rules.VendorCode(null)=="other");
                Assert(new HardwareFacts().OsVersion==null&&new GpuFact().DriverVersion==null);
            });
            test("language "+lang+" invalid drivers never become observed change or JSON",()=>{
                L.SetLanguage(lang);
                foreach(string invalid in new[]{null,"","不明","unknown","192.168.1.123","bad.version"})
                {
                    var a=Sample(GameKind.Wilds,GameSymptom.Launch);var b=Sample(GameKind.Wilds,GameSymptom.Launch);b.TargetSession=a.TargetSession;b.StartUtc=End.AddMinutes(1);b.EndUtc=End.AddMinutes(2);
                    a.Hardware.GpuStatus=b.Hardware.GpuStatus=ReadStatus.Complete;a.Hardware.Gpus[0].DriverVersion=invalid;
                    var j=new ActionJournal();j.Record("wilds-driver",StepState.Tried,ActionOutcome.Unchanged,a,b);Assert(j.Records[0].DriverChange==ObservedChange.Unknown);
                    b.Hardware.Gpus[0].DriverVersion=invalid;string json=FeedbackExport.Build(j.Records,b,true);Assert(!json.Contains("driver_version"));
                }
            });
            test("language "+lang+" safety stop and missing capture remain unknown",()=>{
                L.SetLanguage(lang);var s=Sample(GameKind.General,GameSymptom.LowFps);s.PriorRestartObserved=true;
                var a=new GameAnswers{Symptom=s.Symptom};Assert(!WildsProfile.MayRetest(s,a.Shared));Assert(GameProfile.Plan(s,a).First().Step.Id=="stop");
                s.Application.Events.Clear();Assert(Rules.Analyze(s).Any(x=>x.StepId=="observe"));
                Assert(!FeedbackExport.PublicIntakeVerified);
            });
        }
        foreach(GameKind kind in Enum.GetValues(typeof(GameKind)))foreach(GameSymptom symptom in Enum.GetValues(typeof(GameSymptom)))
        {
            GameKind game=kind;GameSymptom issue=symptom;
            test("bilingual plan and reports "+game+" "+issue,()=>{
                var s=Sample(game,issue);var answers=new GameAnswers{Symptom=issue,Store=GameStore.Steam,Scene=GameScene.Gameplay,Frequency=Frequency.Sometimes,Shared=new WildsAnswers{Mods=Answer.Yes,CaptureTools=Answer.Yes,TexturePack=Answer.Yes,Stage=LaunchStage.GraphicsError}};
                var states=new Dictionary<string,StepState>{{"files",StepState.Tried}};
                L.SetLanguage("ja");string[] ids=GameProfile.Plan(s,answers).Select(x=>x.Step.Id).ToArray();string japanese=GameProfile.Summary(s,answers,states);string[] catalog=GameProfile.Catalog(game,issue).Select(x=>x.Id).ToArray();
                var session=s.TargetSession;var attempt=s.AttemptId;int events=s.Application.Events.Count;
                L.SetLanguage("en");Assert(ids.SequenceEqual(GameProfile.Plan(s,answers).Select(x=>x.Step.Id)));Assert(catalog.SequenceEqual(GameProfile.Catalog(game,issue).Select(x=>x.Id)));
                string english=GameProfile.Summary(s,answers,states)+Rules.BuildReport(s,null,TrialOutcome.Unsure,states)+TraceEvidence.Summary(s,answers.Shared)+CrashArchive.Summary(s.Archive,s,false)+SteamEvidence.Summary(s.Steam);
                Assert(HasJapanese(japanese)&&!HasJapanese(english),"Report not fully localized");Assert(!english.Contains("Original")&&!english.Contains("名前"));
                Assert(s.TargetSession==session&&s.AttemptId==attempt&&s.Application.Events.Count==events);Assert(s.Hardware.LocalCpuName=="Original 日本語 CPU");
                Assert(states["files"]==StepState.Tried&&answers.Shared.Mods==Answer.Yes);
                L.SetLanguage("ja");Assert(GameProfile.Summary(s,answers,states)==japanese,"Round trip changed report/evidence");
            });
        }
        test("history bytes and scope binding unchanged through ja en ja",()=>{
            L.SetLanguage("ja");var j=new ActionJournal();j.Bind(@"C:\Games\Example\game.exe",GameKind.General,GameSymptom.Crash);j.Record("files",StepState.Tried,ActionOutcome.Unchanged);byte[] bytes=j.Encode();string ja=j.Summary();
            L.SetLanguage("en");Assert(bytes.SequenceEqual(j.Encode())&&!HasJapanese(j.Summary()));var decoded=ActionJournal.Decode(bytes);Assert(decoded.Matches(@"C:\Games\Example\game.exe",GameKind.General,GameSymptom.Crash));Assert(!decoded.Matches(@"D:\Other\game.exe",GameKind.General,GameSymptom.Crash));Assert(!decoded.Matches(@"C:\Games\Example\game.exe",GameKind.General,GameSymptom.Launch));Assert(!decoded.Matches(@"C:\Games\Example\game.exe",GameKind.Wilds,GameSymptom.Crash));
            L.SetLanguage("ja");Assert(j.Summary()==ja&&bytes.SequenceEqual(j.Encode()));
        });
        test("feedback JSON byte invariant and privacy projection across languages",()=>{
            var s=Sample(GameKind.Wilds,GameSymptom.Launch);var j=new ActionJournal();j.Record("wilds-files",StepState.Tried,ActionOutcome.Unchanged);L.SetLanguage("ja");string json=FeedbackExport.Build(j.Records,s,true);L.SetLanguage("en");Assert(json==FeedbackExport.Build(j.Records,s,true));Assert(!json.Contains("Original")&&!HasJapanese(json)&&json.Contains("\"unchanged\""));
        });
        test("localized links never invent unavailable English guide or fragment",()=>{
            L.SetLanguage("en");Assert(Rules.Steps.First(x=>x.Id=="observe").GuideUrl.EndsWith("/en/guide/pc-game-crash"));var files=Rules.Steps.First(x=>x.Id=="files");Assert(files.GuideUrl.EndsWith("/guide/verify-steam-files")&&!files.GuideUrl.Contains("/en/"));Assert(L.LinkLabel(files.GuideUrl).EndsWith("(Japanese)"));Assert(files.OfficialUrl.Contains("/en/faqs/"));Assert(WildsProfile.Steps.Where(x=>x.GuideUrl.Contains("/not-launching")).All(x=>!x.GuideUrl.Contains("#")));
        });
        test("all translated step text regenerated after first access",()=>{
            L.SetLanguage("ja");var ja=GameProfile.AllSteps.Select(x=>x.Title).ToArray();L.SetLanguage("en");var en=GameProfile.AllSteps.Select(x=>x.Title).ToArray();Assert(ja.Length==en.Length&&ja.Where((x,i)=>x==en[i]).Count()==0);Assert(GameProfile.SymptomLabels.All(x=>!HasJapanese(x)));L.SetLanguage("ja");Assert(GameProfile.AllSteps.Select(x=>x.Title).SequenceEqual(ja));
        });
        test("proofread shared UI captions remain identical after language switches",()=>{
            L.SetLanguage("en");
            string[][] groups={new[]{"Core.092","MainForm.039","MainFormHistory.004"},new[]{"ActionHistory.002","MainFormHistory.007"},new[]{"ActionHistory.004","MainFormHistory.009"},new[]{"ActionHistory.007","MainFormHistory.012"},new[]{"ActionHistory.008","GameProfile.015","MainFormHistory.006"},new[]{"GameProfile.074","MainForm.004"},new[]{"MainForm.030","WildsCore.106"},new[]{"MainForm.029","WildsCore.105"}};
            foreach(var keys in groups){Assert(keys.Select(L.T).Distinct().Count()==1);foreach(var key in keys)Assert(L.TranslateUiText(L.Text(key,"ja"),"ja")==L.T(key));}
        });
        test("proofread evidence button does not claim a performed step",()=>{
            L.SetLanguage("en");Assert(L.T("MainForm.166").StartsWith("Records available"));Assert(!L.T("MainForm.166").Contains("Step recorded"));
        });
        test("proofread no-change result weakens rather than supports cause hypothesis",()=>{
            L.SetLanguage("en");Assert(L.T("WildsCore.021").Contains("weakens the hypothesis"));Assert(!L.T("WildsCore.021").Contains("weaker evidence that"));
        });
        test("proofread count and minute fragments combine correctly",()=>{
            L.SetLanguage("en");foreach(string key in new[]{"Core.071","Core.072","Core.098","Core.126"})Assert(L.T(key).StartsWith(" min"));
            Assert(("1"+L.T("Core.007")).StartsWith("1 /"));Assert(("1"+L.T("Core.010"))=="1.");Assert(L.T("WildsCore.083")==" total");
            string label=L.T("MainForm.148")+"1"+L.T("MainForm.149")+"1"+L.T("MainForm.150")+"0"+L.T("MainForm.MatchSummaryClose")+Rules.StatusText(ReadStatus.Complete);Assert(label.Contains("(")&&label.Contains(")")&&!label.Contains("）"));
        });
        test("proofread privacy notice retains known-name opt-in and no automatic sending",()=>{
            L.SetLanguage("en");Assert(L.T("Language.OriginalData").Contains("known DLL names are included only if you select the separate option"));Assert(L.T("MainFormHistory.051").Contains("This app has not sent it"));Assert(L.T("MainFormHistory.051").Contains("sync it independently"));
        });
        L.SetLanguage("ja");
    }
}
