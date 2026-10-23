using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using Gemnao.Diagnostics;

internal static class ClientWorkflowTests
{
    private static void Assert(bool value){if(!value)throw new Exception("Assertion failed");}
    private static void Reject(Action action){try{action();}catch(FormatException){return;}throw new Exception("Expected rejection");}
    private static Snapshot Scan(){return new Snapshot{Game=GameKind.Wilds,StartUtc=new DateTime(2026,1,1,1,0,0,DateTimeKind.Utc),EndUtc=new DateTime(2026,1,1,1,1,0,DateTimeKind.Utc),TargetSession=Guid.NewGuid(),AttemptId=Guid.NewGuid()};}
    private static ActionJournal Journal(ActionOutcome outcome=ActionOutcome.Unchanged){var j=new ActionJournal();j.Bind(@"C:\Games\MonsterHunterWilds.exe",GameKind.Wilds,GameSymptom.Launch);j.Record("wilds-files",StepState.Tried,outcome);return j;}
    private static byte[] Bytes(string value){return Encoding.UTF8.GetBytes(value);}
    private static string Xml(ActionJournal j){return Encoding.UTF8.GetString(j.Encode());}
    internal static int WriteFeedbackFixture(string path)
    {
        var j=Journal();j.Record("wilds-steam-client-review",StepState.Tried,ActionOutcome.Resolved);
        File.WriteAllText(path,FeedbackExport.Build(j.Records,Scan(),false,"launch-crash"),new UTF8Encoding(false));return 0;
    }
    internal static void Run(Action<string,Action> Test)
    {
        Test("Steam fixed six items and five module names",()=>Assert(SteamEvidence.Items.Length==6&&SteamEvidence.Items.Count(x=>x.Module)==5));
        Test("Steam arbitrary module name not kept",()=>{var f=new SteamFacts();SteamEvidence.AddModule(f,"private-person.dll",@"C:\Users\private-person\private-person.dll",@"D:\Steam",@"C:\Windows\System32",@"C:\Windows\SysWOW64");Assert(f.Modules.Count==0);});
        Test("Steam known module exact name only",()=>Assert(SteamEvidence.Known("notdwmapi.dll")==null&&SteamEvidence.Known("DWMAPI.DLL")!=null));
        Test("Steam root versus Windows locations distinguished",()=>{Assert(SteamEvidence.ClassifyLocation(@"D:\Steam\dwmapi.dll",@"D:\Steam",@"C:\Windows\System32",@"C:\Windows\SysWOW64")==ModuleLocation.SteamRoot);Assert(SteamEvidence.ClassifyLocation(@"C:\Windows\System32\dwmapi.dll",@"D:\Steam",@"C:\Windows\System32",@"C:\Windows\SysWOW64")==ModuleLocation.WindowsSystem);});
        Test("Steam SysWOW64 classified Windows not root",()=>Assert(SteamEvidence.ClassifyLocation(@"C:\Windows\SysWOW64\xinput1_4.dll",@"D:\Steam",@"C:\Windows\System32",@"C:\Windows\SysWOW64")==ModuleLocation.WindowsSystem));
        Test("Steam prefix lookalike not same root",()=>Assert(SteamEvidence.ClassifyLocation(@"D:\Steam-old\dwmapi.dll",@"D:\Steam",null,null)==ModuleLocation.Other));
        Test("Steam nested folder not direct root",()=>Assert(SteamEvidence.ClassifyLocation(@"D:\Steam\extra\dwmapi.dll",@"D:\Steam",null,null)==ModuleLocation.Other));
        Test("Steam network module path unknown",()=>Assert(SteamEvidence.ClassifyLocation(@"\\server\share\dwmapi.dll",@"D:\Steam",null,null)==ModuleLocation.Unknown));
        Test("Steam missing comparison paths unknown",()=>Assert(SteamEvidence.ClassifyLocation(@"D:\Steam\dwmapi.dll",null,null,null)==ModuleLocation.Unknown));
        Test("Steam duplicates bounded by fixed names and locations",()=>{var f=new SteamFacts();for(int i=0;i<1000;i++)SteamEvidence.AddModule(f,"dwmapi.dll",@"D:\Steam\dwmapi.dll",@"D:\Steam",null,null);Assert(f.Modules.Count==1);});
        Test("Steam no consent is unknown not absent",()=>Assert(SteamEvidence.Observation(new SteamFacts())==SteamObservation.Unknown));
        Test("Steam denied is unknown not absence",()=>Assert(SteamEvidence.Observation(new SteamFacts{ProcessStatus=ReadStatus.AccessDenied})==SteamObservation.Unknown));
        Test("Steam complete no matched process remains unknown",()=>Assert(SteamEvidence.Observation(new SteamFacts{ProcessStatus=ReadStatus.Complete})==SteamObservation.Unknown));
        Test("Steam root module positive survives incomplete status",()=>{var f=new SteamFacts{ProcessStatus=ReadStatus.Partial};f.Modules.Add(new SteamModuleFact{Id=SteamItemId.Dwmapi,Location=ModuleLocation.SteamRoot});Assert(SteamEvidence.Observation(f)==SteamObservation.RootModuleObserved);});
        Test("Steam system-only needs complete observation",()=>{var f=new SteamFacts{ProcessStatus=ReadStatus.Partial,MatchingProcessFound=true};f.Modules.Add(new SteamModuleFact{Id=SteamItemId.Dwmapi,Location=ModuleLocation.WindowsSystem});Assert(SteamEvidence.Observation(f)==SteamObservation.Unknown);f.ProcessStatus=ReadStatus.Complete;Assert(SteamEvidence.Observation(f)==SteamObservation.KnownSystemOnly);});
        Test("Steam capped modules not system-only conclusion",()=>{var f=new SteamFacts{ProcessStatus=ReadStatus.Complete,MatchingProcessFound=true,ModuleLimitReached=true};f.Modules.Add(new SteamModuleFact{Id=SteamItemId.Dwmapi,Location=ModuleLocation.WindowsSystem});Assert(SteamEvidence.Observation(f)==SteamObservation.Unknown);});
        Test("Steam file present alone doesn't prove loaded",()=>{var f=new SteamFacts();f.Files.Add(new SteamFileFact{Id=SteamItemId.OpenSteamTool,State=TraceState.Present,Hidden=true});Assert(SteamEvidence.NeedsReview(f)&&SteamEvidence.Observation(f)==SteamObservation.Unknown&&SteamEvidence.Summary(f).Contains("存在/Hidden属性"));});
        Test("Steam report uses fixed names no paths",()=>{var f=new SteamFacts();SteamEvidence.AddModule(f,"dwmapi.dll",@"C:\Users\private-person\dwmapi.dll",@"D:\Steam",null,null);Assert(!SteamEvidence.Summary(f).Contains("private-person")&&!SteamEvidence.Summary(f).Contains("C:\\"));});
        Test("Steam rule only after scoped observation",()=>{var s=Scan();Assert(!WildsProfile.Plan(s,new WildsAnswers()).Any(x=>x.Step.Id=="wilds-steam-client-review"));s.Steam.Files.Add(new SteamFileFact{Id=SteamItemId.Dwmapi,State=TraceState.Present});Assert(WildsProfile.Plan(s,new WildsAnswers()).Any(x=>x.Step.Id=="wilds-steam-client-review"));});
        Test("Steam branch never overrides safety stop",()=>{var s=Scan();s.Steam.Files.Add(new SteamFileFact{Id=SteamItemId.Dwmapi,State=TraceState.Present});Assert(WildsProfile.Plan(s,new WildsAnswers{WholePcIssue=Answer.Yes})[0].Step.Id=="wilds-stop");});
        Test("history roundtrip flags restored not machine verified",()=>{var j=ActionJournal.Decode(Journal().Encode());Assert(j.Restored&&j.Records.Count==1&&j.Records[0].Outcome==ActionOutcome.Unchanged&&j.Summary().Contains("同一性は自動検証していません"));});
        Test("history latest result preserves failed action",()=>{var j=Journal();j.Record("wilds-files",StepState.Tried,ActionOutcome.Resolved);Assert(j.Latest("wilds-files").Outcome==ActionOutcome.Resolved&&j.Records.Count==2);});
        Test("history unknown remains unrecorded",()=>{var j=new ActionJournal();j.Record("wilds-driver",StepState.NotStarted,ActionOutcome.Unrecorded);Assert(j.Latest("wilds-driver").Outcome==ActionOutcome.Unrecorded);});
        Test("history improvement never auto resolved",()=>Assert(ActionJournal.FromTrial(TrialOutcome.Better)==ActionOutcome.Improved));
        Test("history not tested never auto unchanged",()=>Assert(ActionJournal.FromTrial(TrialOutcome.NotTested)==ActionOutcome.Unrecorded));
        Test("history fixed limit64 and ordered sequence",()=>{var j=Journal();for(int i=0;i<100;i++)j.Record("wilds-files",StepState.Tried,ActionOutcome.Unchanged);Assert(j.Records.Count==64&&j.Records[0].Sequence==1&&j.Records[63].Sequence==64&&ActionJournal.Decode(j.Encode()).Records.Count==64);});
        Test("history unknown action rejects code URL and path",()=>{foreach(string id in new[]{"https://private.example/","C:\\Users\\private","<script>","new-fix"})Reject(()=>new ActionJournal().Record(id,StepState.Tried,ActionOutcome.Resolved));});
        Test("history invalid enum rejected",()=>Reject(()=>new ActionJournal().Record("wilds-files",(StepState)999,ActionOutcome.Unknown)));
        Test("history resolved requires explicit tried state",()=>Reject(()=>new ActionJournal().Record("wilds-files",StepState.NotStarted,ActionOutcome.Resolved)));
        Test("history not tried conflicts with tried state",()=>Reject(()=>new ActionJournal().Record("wilds-files",StepState.Tried,ActionOutcome.NotTried)));
        Test("history unknown schema rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("schema=\"2\"","schema=\"3\"")))));
        Test("history wrong game rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("2246340","1234567")))));
        Test("history extra field rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("outcome=", "private=\"secret\" outcome=")))));
        Test("history path as action rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("wilds-files",@"C:\Users\private-person")))));
        Test("history negative enum rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("state=\"2\"","state=\"-1\"")))));
        Test("history sequence gap rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("n=\"1\"","n=\"2\"")))));
        Test("history duplicate attribute rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("state=\"2\"","state=\"2\" state=\"0\"")))));
        Test("history nested payload rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace(" />"," ><code>private</code></record>")))));
        Test("history oversized input rejected",()=>Reject(()=>ActionJournal.Decode(new byte[32769])));
        Test("history DTD and external entities rejected",()=>Reject(()=>ActionJournal.Decode(Bytes("<!DOCTYPE x [<!ENTITY e SYSTEM 'file:///private'>]><gemnao-history schema='1' game='2246340'>&e;</gemnao-history>"))));
        Test("history processing instruction rejected",()=>Reject(()=>ActionJournal.Decode(Bytes("<?run private?>"+Xml(Journal())))));
        Test("history contradictory unobserved delta rejected",()=>Reject(()=>ActionJournal.Decode(Bytes(Xml(Journal()).Replace("driver=\"0\"","driver=\"1\"")))));
        Test("history same session observations distinct from self result",()=>{var a=Scan();var b=Scan();b.TargetSession=a.TargetSession;b.StartUtc=a.EndUtc.AddMinutes(1);b.EndUtc=b.StartUtc.AddMinutes(1);a.Steam.Modules.Add(new SteamModuleFact{Id=SteamItemId.Dwmapi,Location=ModuleLocation.SteamRoot});b.Steam.ProcessStatus=ReadStatus.Complete;b.Steam.MatchingProcessFound=true;b.Steam.Modules.Add(new SteamModuleFact{Id=SteamItemId.Dwmapi,Location=ModuleLocation.WindowsSystem});var j=new ActionJournal();j.Record("wilds-steam-client-review",StepState.Tried,ActionOutcome.Resolved,a,b);Assert(j.Records[0].SameSessionComparison&&j.Records[0].SteamBefore==SteamObservation.RootModuleObserved&&j.Records[0].SteamAfter==SteamObservation.KnownSystemOnly&&j.Summary().Contains("根因だと確定しません"));});
        Test("history cross session not compared",()=>{var a=Scan();var b=Scan();b.StartUtc=a.EndUtc.AddMinutes(1);b.EndUtc=b.StartUtc.AddMinutes(1);var j=new ActionJournal();j.Record("wilds-driver",StepState.Tried,ActionOutcome.Improved,a,b);Assert(!j.Records[0].SameSessionComparison&&j.Records[0].DriverChange==ObservedChange.NotCompared);});
        Test("history same attempt refresh not new observation trial",()=>{var a=Scan();var b=Scan();b.TargetSession=a.TargetSession;b.AttemptId=a.AttemptId;b.StartUtc=a.EndUtc.AddMinutes(1);b.EndUtc=b.StartUtc.AddMinutes(1);var j=new ActionJournal();j.Record("wilds-driver",StepState.Tried,ActionOutcome.Unchanged,a,b);Assert(!j.Records[0].SameSessionComparison);});
        Test("history import doesn't retain free prose or identifiers",()=>{string xml=Xml(Journal());foreach(string x in new[]{"Users","@","http","TargetSession","AttemptId","DeviceId"})Assert(!xml.Contains(x));});
        Test("feedback contract root keys exactly minimal",()=>{using(var doc=JsonDocument.Parse(FeedbackExport.Build(Journal().Records,null,false))){var keys=doc.RootElement.EnumerateObject().Select(x=>x.Name).ToArray();Assert(keys.OrderBy(x=>x).SequenceEqual(new[]{"schema_version","game_id","symptom","source","tool_version","rule_version","actions"}.OrderBy(x=>x)));Assert(doc.RootElement.GetProperty("actions")[0].GetProperty("evidence").GetString()=="self-report");}});
        Test("feedback symptom defaults unknown",()=>{using(var doc=JsonDocument.Parse(FeedbackExport.Build(Journal().Records,null,false)))Assert(doc.RootElement.GetProperty("symptom").GetString()=="unknown");});
        Test("feedback explicit shader symptom retained",()=>Assert(FeedbackExport.Build(Journal().Records,null,false,"shader-preparation").Contains("shader-preparation")));
        Test("feedback arbitrary symptom rejected",()=>Reject(()=>FeedbackExport.Build(Journal().Records,null,false,"https://private")));
        Test("feedback environment optin off excludes PC details",()=>{var s=Scan();s.Hardware.OsVersion="10.0.26000";s.Hardware.Gpus.Add(new GpuFact{Vendor="NVIDIA",DriverVersion="32.0.15.9999"});string json=FeedbackExport.Build(Journal().Records,s,false);Assert(!json.Contains("os_family")&&!json.Contains("gpu_vendor")&&!json.Contains("driver_version"));});
        Test("feedback optional environment coarse bounded",()=>{var s=Scan();s.Hardware.OsVersion="10.0.26000";s.Hardware.Gpus.Add(new GpuFact{Vendor="NVIDIA",DriverVersion="32.0.15.9999"});string json=FeedbackExport.Build(Journal().Records,s,true);using(var doc=JsonDocument.Parse(json)){Assert(doc.RootElement.GetProperty("os_family").GetString()=="windows-11"&&doc.RootElement.GetProperty("gpu_vendor").GetString()=="nvidia");}Assert(!json.Contains("26000"));});
        Test("feedback no raw module paths timestamps or history observations",()=>{var s=Scan();s.Hardware.LocalCpuName=@"C:\Users\private-person";s.Hardware.LocalGpuNames.Add("private@example.com");s.Application.Events.Add(new EventFact{LocalModuleName="private-person.dll"});s.Steam.Modules.Add(new SteamModuleFact{Id=SteamItemId.OpenSteamTool,Location=ModuleLocation.SteamRoot});var j=Journal();j.Records[0].SteamAfter=SteamObservation.RootModuleObserved;string json=FeedbackExport.Build(j.Records,s,true);foreach(string x in new[]{"private-person","@","OpenSteamTool","SteamRoot","2026","Sequence","observed"})Assert(!json.Contains(x));});
        Test("feedback unrecorded rejected not treated failed",()=>{var j=new ActionJournal();j.Record("wilds-driver",StepState.NotStarted,ActionOutcome.Unrecorded);Reject(()=>FeedbackExport.Build(j.Records,null,false));});
        Test("feedback zero selected rejected",()=>Reject(()=>FeedbackExport.Build(new List<ActionRecord>(),null,false)));
        Test("feedback over eight rejected",()=>Reject(()=>FeedbackExport.Build(FeedbackExport.AllowedActions.Take(9).Select(x=>new ActionRecord{ActionId=x,State=StepState.Tried,Outcome=ActionOutcome.Unchanged}).ToList(),null,false)));
        Test("feedback duplicate action rejected",()=>{var j=Journal();j.Record("wilds-files",StepState.Tried,ActionOutcome.Resolved);Reject(()=>FeedbackExport.Build(j.Records,null,false));});
        Test("feedback arbitrary action or enum rejected",()=>Reject(()=>FeedbackExport.Build(new[]{new ActionRecord{ActionId="evil",State=StepState.Tried,Outcome=ActionOutcome.Resolved}},null,false)));
        Test("feedback not tried stays not tried",()=>{var j=new ActionJournal();j.Record("wilds-files",StepState.NotStarted,ActionOutcome.NotTried);Assert(FeedbackExport.Build(j.Records,null,false).Contains("not-tried"));});
        Test("feedback explicit unknown stays unknown",()=>{var j=Journal(ActionOutcome.Unknown);Assert(FeedbackExport.Build(j.Records,null,false).Contains("\"outcome\":\"unknown\""));});
        Test("feedback resolution explicit only",()=>Assert(FeedbackExport.Outcome(ActionOutcome.Improved)=="improved"&&FeedbackExport.Outcome(ActionOutcome.Resolved)=="resolved"));
        Test("feedback version grammar rejects private strings",()=>Assert(!FeedbackExport.ValidVersion("private@example.com")&&!FeedbackExport.ValidVersion("https://private")&&!FeedbackExport.ValidVersion("123456.1")&&!FeedbackExport.ValidVersion("1.2.3.4.5")));
        Test("feedback driver injection not exported",()=>{var s=Scan();s.Hardware.Gpus.Add(new GpuFact{DriverVersion="1.2.3.4\",\"name\":\"secret"});Assert(!FeedbackExport.Build(Journal().Records,s,true).Contains("secret"));});
        Test("feedback payload below contract byte limit",()=>{var list=FeedbackExport.AllowedActions.Take(8).Select(x=>new ActionRecord{ActionId=x,State=StepState.Tried,Outcome=ActionOutcome.Resolved}).ToList();Assert(Encoding.UTF8.GetByteCount(FeedbackExport.Build(list,Scan(),true))<=4096);});
        Test("feedback website link remains disabled",()=>Assert(!FeedbackExport.PublicIntakeVerified&&!FeedbackExport.PageUrl.Contains("?")&&!FeedbackExport.PageUrl.Contains("#")));
        Test("history 500 malformed inputs fail closed",()=>{var rng=new Random(414);for(int i=0;i<500;i++){var data=new byte[rng.Next(0,5000)];rng.NextBytes(data);try{ActionJournal.Decode(data);}catch(FormatException){continue;}throw new Exception("Random history accepted");}});
    }
}
