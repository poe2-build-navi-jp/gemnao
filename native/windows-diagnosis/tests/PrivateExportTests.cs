using System;
using System.IO;
using System.Text.Json;
using Gemnao.Diagnostics;
internal static class PrivateExportTests
{
    private static void Assert(bool condition){if(!condition)throw new Exception("Private export assertion failed");}
    internal static string Fixture(){var s=new Snapshot{Game=GameKind.General,Symptom=GameSymptom.Crash};s.Application.Status=ReadStatus.Complete;s.System.Status=ReadStatus.Unavailable;return PrivateDiagnosticExport.Build(s,new WildsAnswers{WholePcIssue=Answer.No},TrialOutcome.NotTested,"game-context");}
    internal static int WriteFixture(string path){File.WriteAllText(path,Fixture());return 0;}
    internal static void Run(Action<string,Action> test)
    {
        test("private JSON no full snapshot or identifiers",()=>{var s=new Snapshot();s.Hardware.LocalCpuName="SYNTHETIC_PRIVATE";s.Hardware.LocalGpuNames.Add("SYNTHETIC_PRIVATE");s.Application.Events.Add(new EventFact{Match=MatchKind.ExactPath,LocalModuleName="SYNTHETIC_PRIVATE"});s.Application.Examined=1;var text=PrivateDiagnosticExport.Build(s,new WildsAnswers(),TrialOutcome.Unsure);Assert(!text.Contains("SYNTHETIC_PRIVATE"));using(var d=JsonDocument.Parse(text)){Assert(d.RootElement.GetProperty("observed").GetProperty("application").GetProperty("exact_matches").GetInt32()==1);Assert(d.RootElement.GetProperty("self_report").GetProperty("trial").GetString()=="unsure");}});
        test("private yes no unknown enum order",()=>{foreach(var a in new[]{Answer.Unknown,Answer.No,Answer.Yes}){using(var d=JsonDocument.Parse(PrivateDiagnosticExport.Build(new Snapshot(),new WildsAnswers{WholePcIssue=a},TrialOutcome.NotTested))){Assert(d.RootElement.GetProperty("self_report").GetProperty("whole_pc_issue").GetString()==(a==Answer.Unknown?"unknown":a==Answer.Yes?"yes":"no"));}}});
        test("private every collection status and symptom remains structured",()=>{foreach(ReadStatus status in Enum.GetValues(typeof(ReadStatus)))foreach(GameSymptom symptom in Enum.GetValues(typeof(GameSymptom))){var s=new Snapshot{Symptom=symptom};s.Application.Status=status;using(var d=JsonDocument.Parse(PrivateDiagnosticExport.Build(s,new WildsAnswers(),TrialOutcome.NotTested)))Assert(d.RootElement.GetProperty("observed").GetProperty("application").GetProperty("status").GetString().Length>0);}});
        test("private language changes never alter payload",()=>{L.SetLanguage("ja");string a=Fixture();L.SetLanguage("en");Assert(a==Fixture());L.SetLanguage("ja");});
        test("private next step fixed allowlist only",()=>{try{PrivateDiagnosticExport.Build(new Snapshot(),new WildsAnswers(),TrialOutcome.NotTested,"SYNTHETIC_PRIVATE");throw new Exception("accepted");}catch(FormatException){}foreach(var step in GameProfile.AllSteps){using(var d=JsonDocument.Parse(PrivateDiagnosticExport.Build(new Snapshot(),new WildsAnswers(),TrialOutcome.NotTested,step.Id)))Assert(d.RootElement.GetProperty("next_step").GetString()==step.Id);}});
        test("private invalid or inconsistent evidence rejected",()=>{foreach(var s in new[]{new Snapshot(),new Snapshot(),new Snapshot()}){s.Application.Examined=301;try{PrivateDiagnosticExport.Build(s,new WildsAnswers(),TrialOutcome.NotTested);throw new Exception("accepted");}catch(FormatException){}}var bad=new Snapshot();bad.Application.Events.Add(new EventFact());try{PrivateDiagnosticExport.Build(bad,new WildsAnswers(),TrialOutcome.NotTested);throw new Exception("accepted");}catch(FormatException){}});
    }
}
