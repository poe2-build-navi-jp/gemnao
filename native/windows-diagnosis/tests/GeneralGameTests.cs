using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Gemnao.Diagnostics;
internal static class GeneralGameTests
{
    private static void Assert(bool value){if(!value)throw new Exception("Assertion failed");}
    private static void Reject(Action action){try{action();}catch(FormatException){return;}throw new Exception("Expected rejection");}
    private static Snapshot Scan(GameSymptom symptom=GameSymptom.Launch){return new Snapshot{Game=GameKind.General,Symptom=symptom,TargetSession=Guid.NewGuid()};}
    private static GameAnswers Answers(GameSymptom symptom){return new GameAnswers{Symptom=symptom};}
    internal static void Run(Action<string,Action> test)
    {
        test("generic accepts arbitrary local exe",()=>Assert(GameProfile.Accepts(@"C:\Games\another.exe",GameKind.General)));
        test("Wilds profile rejects other exe",()=>Assert(!GameProfile.Accepts(@"C:\Games\another.exe",GameKind.Wilds)));
        test("generic rejects UNC link URL non exe",()=>{foreach(string p in new[]{@"\\server\game.exe","https://game.exe",@"C:\Games\x.bat"})Assert(!GameProfile.Accepts(p,GameKind.General));});
        test("generic all six symptom plans exist distinct",()=>{foreach(GameSymptom symptom in Enum.GetValues(typeof(GameSymptom))){var plan=GameProfile.Plan(Scan(symptom),Answers(symptom));Assert(plan.Count>0&&plan.All(x=>!x.Step.Id.StartsWith("wilds-")));}});
        test("generic performance explicitly unmeasured",()=>{string text=GameProfile.Summary(Scan(GameSymptom.LowFps),Answers(GameSymptom.LowFps),null);Assert(text.Contains("測定していません")&&text.Contains("本人申告")&&!text.Contains("【ワイルズ専用"));});
        test("generic low fps proposes comparable game setting",()=>Assert(GameProfile.Plan(Scan(),Answers(GameSymptom.LowFps)).Any(x=>x.Step.Id=="game-performance")));
        test("generic failed graphics comparison not repeated",()=>{var a=Answers(GameSymptom.LowFps);a.LowerGraphics=GraphicsTrial.Same;Assert(!GameProfile.Plan(Scan(),a).Any(x=>x.Step.Id=="game-performance"));});
        test("generic stutter separate waiting branch",()=>Assert(GameProfile.Plan(Scan(),Answers(GameSymptom.Stutter))[0].Step.Id=="game-stutter"));
        test("generic freeze separate branch",()=>Assert(GameProfile.Plan(Scan(),Answers(GameSymptom.Freeze))[0].Step.Id=="game-freeze"));
        test("generic blackscreen separate branch",()=>Assert(GameProfile.Plan(Scan(),Answers(GameSymptom.BlackScreen))[0].Step.Id=="game-black-screen"));
        test("generic other has no speculative repair",()=>Assert(GameProfile.Plan(Scan(),Answers(GameSymptom.Other)).Count==2));
        test("generic no Steam verification for other store",()=>{var a=Answers(GameSymptom.Crash);a.Store=GameStore.Other;var s=Scan();s.Application.Events.Add(new EventFact{Kind=EventKind.ApplicationCrash});Assert(!GameProfile.Plan(s,a).Any(x=>x.Step.Id=="files"));});
        test("generic Steam verification available",()=>{var a=Answers(GameSymptom.Launch);a.Store=GameStore.Steam;Assert(GameProfile.Plan(Scan(),a).Any(x=>x.Step.Id=="files"));});
        test("generic PC issue stops every symptom",()=>{foreach(GameSymptom symptom in Enum.GetValues(typeof(GameSymptom))){var a=Answers(symptom);a.Shared.WholePcIssue=Answer.Yes;Assert(GameProfile.Plan(Scan(),a)[0].Step.Id=="stop");}});
        test("generic only reported overlays recommended",()=>{var a=Answers(GameSymptom.Crash);Assert(!GameProfile.Plan(Scan(),a).Any(x=>x.Step.Id=="game-capture"));a.Shared.CaptureTools=Answer.Yes;Assert(GameProfile.Plan(Scan(),a).Any(x=>x.Step.Id=="game-capture"));});
        test("Wilds lowfps uses common performance rules",()=>{var s=Scan();s.Game=GameKind.Wilds;Assert(GameProfile.Plan(s,Answers(GameSymptom.LowFps)).All(x=>!x.Step.Id.StartsWith("wilds-")));});
        test("Wilds launch retains specific patterns",()=>{var s=Scan();s.Game=GameKind.Wilds;Assert(GameProfile.Plan(s,Answers(GameSymptom.Launch)).Any(x=>x.Step.Id=="wilds-files"));});
        test("history v2 binds distinct generic exe",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Freeze);j.Record("game-freeze",StepState.Tried,ActionOutcome.Unchanged);var v=ActionJournal.Decode(j.Encode());Assert(v.Matches(@"c:\games\A.exe",GameKind.General,GameSymptom.Freeze)&&!v.Matches(@"C:\Games\b.exe",GameKind.General,GameSymptom.Freeze));});
        test("history v2 same basename other installation rejected",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);Assert(!j.Matches(@"D:\Games\a.exe",GameKind.General,GameSymptom.Crash));});
        test("history v2 cannot cross symptom or profile",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\MonsterHunterWilds.exe",GameKind.General,GameSymptom.Crash);Assert(!j.Matches(@"C:\Games\MonsterHunterWilds.exe",GameKind.Wilds,GameSymptom.Crash)&&!j.Matches(@"C:\Games\MonsterHunterWilds.exe",GameKind.General,GameSymptom.Freeze));});
        test("history target path never stored or shared",()=>{var j=new ActionJournal();j.Bind(@"C:\Users\private-person\abc.exe",GameKind.General,GameSymptom.Crash);string xml=Encoding.UTF8.GetString(j.Encode());Assert(!xml.Contains("private-person")&&!xml.Contains("abc.exe")&&!j.Summary().Contains("binding"));});
        test("history salted per journal no universal identity",()=>{var a=new ActionJournal();var b=new ActionJournal();a.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);b.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);Assert(!a.Encode().SequenceEqual(b.Encode()));});
        test("unbound history cannot persist",()=>Reject(()=>new ActionJournal().Encode()));
        test("old Wilds history rejected no silent migration",()=>Reject(()=>ActionJournal.Decode(Encoding.UTF8.GetBytes("<gemnao-history schema='1' game='2246340' />"))));
        test("general journal cannot record Wilds actions",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);Reject(()=>j.Record("wilds-files",StepState.Tried,ActionOutcome.Resolved));});
        test("cross symptom snapshot comparison rejected",()=>{var a=Scan();var b=Scan(GameSymptom.LowFps);b.TargetSession=a.TargetSession;Assert(Rules.Compare(a,b,TrialOutcome.Better).Contains("症状"));});
        test("generic local selection rejects traversal and excessive paths",()=>{Assert(!GameProfile.Accepts(@"C:\Games\..\private.exe",GameKind.General));Assert(!GameProfile.Accepts("C:\\"+new string('a',250)+".exe",GameKind.General));});
        test("unknown game enum rejected",()=>Assert(!GameProfile.Accepts(@"C:\Games\a.exe",(GameKind)22)));
        test("unknown symptom cannot bind saved history",()=>Reject(()=>new ActionJournal().Bind(@"C:\Games\a.exe",GameKind.General,(GameSymptom)55)));
        test("history malformed binding refuses decode",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);string x=Encoding.UTF8.GetString(j.Encode());int start=x.IndexOf("binding=\"")+9;x=x.Substring(0,start)+"G"+x.Substring(start+1);Reject(()=>ActionJournal.Decode(Encoding.UTF8.GetBytes(x)));});
        test("history malicious game string refused",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);string x=Encoding.UTF8.GetString(j.Encode()).Replace("game=\"general\"","game=\"https://private.example\"");Reject(()=>ActionJournal.Decode(Encoding.UTF8.GetBytes(x)));});
        test("history scope action mismatch rejects decoded payload",()=>{var j=new ActionJournal();j.Bind(@"C:\Games\a.exe",GameKind.General,GameSymptom.Crash);j.Record("files",StepState.Tried,ActionOutcome.Unchanged);string x=Encoding.UTF8.GetString(j.Encode()).Replace("action=\"files\"","action=\"wilds-files\"");Reject(()=>ActionJournal.Decode(Encoding.UTF8.GetBytes(x)));});
        test("generic failed action can be skipped next",()=>{var a=Answers(GameSymptom.BlackScreen);var plan=GameProfile.Plan(Scan(),a);var states=new Dictionary<string,StepState>{{"game-black-screen",StepState.Tried}};Assert(WildsProfile.NextUntried(plan,states)>0);});
        test("generic all known actions have fixed HTTPS links",()=>Assert(GameProfile.Steps.All(x=>x.GuideUrl.StartsWith("https://gemnao.pages.dev/")&&x.OfficialUrl.StartsWith("https://"))));
        test("generic RAM rule does not assume Wilds16GB",()=>{var s=Scan();s.Wilds.InstalledRamMiB=8192;var text=GameProfile.Summary(s,Answers(GameSymptom.Crash),null);Assert(!text.Contains("16GB")&&!text.Contains("wilds-requirements"));});
        test("generic hardware zero logs not success",()=>Assert(GameProfile.Summary(Scan(),Answers(GameSymptom.Crash),null).Contains("記録ゼロは正常の証明ではありません")));
        test("Wilds in-game crash avoids launch-only plan",()=>{var s=Scan(GameSymptom.Crash);s.Game=GameKind.Wilds;Assert(GameProfile.Plan(s,Answers(GameSymptom.Crash)).All(x=>!x.Step.Id.StartsWith("wilds-")));});
        test("cross symptom refresh rejected",()=>{var a=Scan(GameSymptom.Crash);a.StartUtc=DateTime.UtcNow.AddMinutes(-2);a.EndUtc=a.StartUtc.AddMinutes(1);a.AttemptId=Guid.NewGuid();var b=Scan(GameSymptom.Freeze);b.TargetSession=a.TargetSession;b.StartUtc=a.StartUtc;b.EndUtc=a.EndUtc.AddSeconds(10);CaptureTransition transition;Assert(!CaptureWorkflow.TryCommit(b,a,null,a.TargetSession,false,CaptureMode.Refresh,TrialOutcome.Same,out transition));});
        test("generic feedback refuses Wilds game id",()=>Reject(()=>FeedbackExport.Build(new[]{new ActionRecord{ActionId="wilds-files",State=StepState.Tried,Outcome=ActionOutcome.Resolved}},Scan(),false)));
    }
}
