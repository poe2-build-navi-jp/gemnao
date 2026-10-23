using System;
using System.Collections.Generic;
using System.Linq;
using Gemnao.Diagnostics;

internal static class WildsTests
{
    private static void Assert(bool value,string reason="Assertion failed") { if(!value)throw new Exception(reason); }
    private static void Reject(Action run) { try { run(); } catch(FormatException) { return; } throw new Exception("Expected rejection"); }
    private static Snapshot Scan()
    {
        var s=new Snapshot { StartUtc=new DateTime(2026,10,2,8,0,0,DateTimeKind.Utc),EndUtc=new DateTime(2026,10,2,8,1,0,DateTimeKind.Utc),TargetSession=Guid.NewGuid() };
        s.Application.Status=s.System.Status=ReadStatus.Complete; return s;
    }
    internal static void Run(Action<string,Action> Test)
    {
        Test("game file version uses typed numbers without IPv4 string",()=>Assert(WildsProfile.GameVersionText(new[]{1,42,0,0}).StartsWith("1 / 42 / 0 / 0")));
        Test("malformed game version rejected",()=>Assert(WildsProfile.GameVersionText(new[]{999999,1,1,1})=="不明"));
        Test("Wilds exact executable accepted",()=>Assert(WildsProfile.IsTarget(@"C:\Games\MonsterHunterWilds.exe")));
        Test("Wilds crash reporter is not game",()=>Assert(!WildsProfile.IsTarget(@"C:\Games\CrashReport.exe")));
        Test("Wilds benchmark is not game",()=>Assert(!WildsProfile.IsTarget(@"C:\Games\MonsterHunterWildsBenchmark.exe")));
        Test("Wilds expected name is case-insensitive",()=>Assert(WildsProfile.IsTarget(@"C:\Games\monsterhunterwilds.EXE")));
        Test("Wilds UNC rejected",()=>Assert(!WildsProfile.IsTarget(@"\\server\Games\MonsterHunterWilds.exe")));
        Test("Steam registry forward slash normalized",()=>Assert(SteamText.NormalizeLocalPath("c:/Program Files (x86)/Steam")==@"C:\Program Files (x86)\Steam"));
        Test("Steam normalized game matches expected exe",()=>Assert(WildsProfile.IsTarget(SteamText.NormalizeLocalPath("d:/SteamLibrary/steamapps/common/MonsterHunterWilds/MonsterHunterWilds.exe"))));
        Test("Steam path normalization rejects remote",()=>Assert(SteamText.NormalizeLocalPath("//server/share")==null));
        Test("Steam modern library format",()=>{ var p=SteamText.LibraryPaths("\"libraryfolders\" { \"0\" { \"path\" \"C:\\\\Steam\" \"label\" \"private\" \"apps\" { \"2246340\" \"75000\" } } \"1\" { \"path\" \"D:\\\\Games\" } }"); Assert(p.SequenceEqual(new[]{@"C:\Steam",@"D:\Games"})); });
        Test("Steam legacy library format",()=>Assert(SteamText.LibraryPaths("\"LibraryFolders\" { \"0\" \"D:\\\\SteamLibrary\" }").Single()==@"D:\SteamLibrary"));
        Test("Steam comments accepted",()=>Assert(SteamText.LibraryPaths("// hi\n\"libraryfolders\" { // hi\n\"1\" \"D:/Games\" }").Length==1));
        Test("Steam account identifier is not a returned field",()=>{ var p=SteamText.LibraryPaths("\"libraryfolders\" { \"0\" { \"path\" \"C:/Steam\" \"contentid\" \"private-id\" \"label\" \"alice@example.com\" } }"); Assert(string.Join(";",p)=="C:/Steam"); });
        Test("Steam nonnumeric metadata ignored",()=>Assert(SteamText.LibraryPaths("\"libraryfolders\" { \"contentid\" \"C:/private\" \"0\" \"C:/Steam\" }").Length==1));
        Test("Steam remote library excluded",()=>Assert(SteamText.LibraryPaths("\"libraryfolders\" { \"0\" \"//server/share\" }").Length==0));
        Test("Steam parent traversal excluded",()=>Assert(!SteamText.IsLocalDirectory(@"C:\Steam\..\private")));
        Test("Steam device path excluded",()=>Assert(!SteamText.IsLocalDirectory(@"\\?\C:\Games")));
        Test("Steam alternate streams excluded",()=>Assert(!SteamText.IsLocalDirectory(@"C:\Games:secret")));
        Test("Steam control chars excluded",()=>Assert(!SteamText.IsLocalDirectory("C:/Steam\nprivate")));
        Test("Steam bounded paths",()=>Assert(!SteamText.IsLocalDirectory("C:/"+new string('x',250))));
        Test("Steam manifest only correct app id",()=>Assert(SteamText.InstallDirectory("\"AppState\" { \"appid\" \"2246340\" \"installdir\" \"MonsterHunterWilds\" \"LastOwner\" \"76561198000000000\" }")=="MonsterHunterWilds"));
        Test("Steam wrong app manifest excluded",()=>Assert(SteamText.InstallDirectory("\"AppState\" { \"appid\" \"123\" \"installdir\" \"MonsterHunterWilds\" }")==null));
        Test("Steam install directory traversal excluded",()=>Assert(SteamText.InstallDirectory("\"AppState\" { \"appid\" \"2246340\" \"installdir\" \"../private\" }")==null));
        Test("Steam install path is one component",()=>Assert(SteamText.InstallDirectory("\"AppState\" { \"appid\" \"2246340\" \"installdir\" \"C:/private\" }")==null));
        Test("Steam trailing dot directory rejected",()=>Assert(SteamText.InstallDirectory("\"AppState\" { \"appid\" \"2246340\" \"installdir\" \"name.\" }")==null));
        Test("Steam include directive rejected",()=>Reject(()=>SteamText.Parse("#include \"private\"")));
        Test("Steam duplicate keys rejected",()=>Reject(()=>SteamText.Parse("\"a\" \"1\" \"A\" \"2\"")));
        Test("Steam dangling object rejected",()=>Reject(()=>SteamText.Parse("\"a\" { \"b\" \"x\"")));
        Test("Steam unclosed quotes rejected",()=>Reject(()=>SteamText.Parse("\"a\" \"b")));
        Test("Steam unexpected closing brace rejected",()=>Reject(()=>SteamText.Parse("}")));
        Test("Steam file size bound",()=>Reject(()=>SteamText.Parse(new string('x',1048577))));
        Test("Steam token string bound",()=>Reject(()=>SteamText.Parse("\"a\" \""+new string('x',4097)+"\"")));
        Test("Steam nesting bound",()=>Reject(()=>SteamText.Parse(string.Concat(Enumerable.Repeat("\"a\" { ",12))+string.Concat(Enumerable.Repeat("}",12)))));
        Test("Steam token count bound",()=>Reject(()=>SteamText.Parse(string.Concat(Enumerable.Range(0,4200).Select(x=>"\""+x+"\" \"v\" ")))));
        Test("Steam directory discovery cap",()=>Assert(SteamText.LibraryPaths("\"libraryfolders\" { "+string.Concat(Enumerable.Range(0,50).Select(x=>"\""+x+"\" \"C:/Steam"+x+"\" "))+"}").Length==16));
        Test("compatibility flags exact tokens",()=>Assert(WildsProfile.HasCompatibilityFlag("~ WIN8RTM HIGHDPIAWARE")));
        Test("unknown compatibility not inferred",()=>Assert(!WildsProfile.HasCompatibilityFlag("SOMEWIN8RTMOTHER")));
        Test("normal flags not compatibility mode",()=>Assert(!WildsProfile.HasCompatibilityFlag("~ DISABLEDXMAXIMIZEDWINDOWEDMODE")));
        Test("admin flag separately classified",()=>Assert(WildsProfile.HasAdminFlag("~ RUNASADMIN")&&!WildsProfile.HasCompatibilityFlag("~ RUNASADMIN")));
        Test("Whole PC self-report blocks retest even no event",()=>Assert(!WildsProfile.MayRetest(Scan(),new WildsAnswers { WholePcIssue=Answer.Yes })));
        Test("KernelPower41 blocks retest",()=>{ var s=Scan(); s.System.Events.Add(new EventFact { Kind=EventKind.UncleanRestart }); Assert(!WildsProfile.MayRetest(s,new WildsAnswers { WholePcIssue=Answer.No })); });
        Test("unknown PC status does not claim safe",()=>Assert(WildsProfile.MayRetest(Scan(),new WildsAnswers())&&WildsProfile.AnswerText(Answer.Unknown)=="分からない"));
        Test("PC stop plan excludes ordinary retest actions",()=>{ var p=WildsProfile.Plan(Scan(),new WildsAnswers { WholePcIssue=Answer.Yes }); Assert(p.First().Step.Id=="wilds-stop" && p.Count==2 && !p.Any(x=>x.Step.Id=="wilds-files")); });
        Test("security notice plan comes first",()=>Assert(WildsProfile.Plan(Scan(),new WildsAnswers { Stage=LaunchStage.SecurityNotice }).First().Step.Id=="wilds-security"));
        Test("compat flag plan comes before blind verification",()=>{ var s=Scan(); s.Wilds.GameCompatibility=true; Assert(WildsProfile.Plan(s,new WildsAnswers()).First().Step.Id=="wilds-compatibility"); });
        Test("mods yes gets conditional manual action",()=>Assert(WildsProfile.Plan(Scan(),new WildsAnswers { Mods=Answer.Yes }).Any(x=>x.Step.Id=="wilds-mods"&&x.Reason.Contains("申告"))));
        Test("mods no not falsely inferred from crashes",()=>Assert(!WildsProfile.Plan(Scan(),new WildsAnswers { Mods=Answer.No }).Any(x=>x.Step.Id=="wilds-mods")));
        Test("verification already done avoids verify loop",()=>Assert(!WildsProfile.Plan(Scan(),new WildsAnswers { Verification=VerifyResult.NoFilesReacquired }).Any(x=>x.Step.Id=="wilds-files")));
        Test("verification files reacquired is not cure",()=>{ var s=WildsProfile.Summary(Scan(),new WildsAnswers { Verification=VerifyResult.FilesReacquired },null); Assert(s.Contains("未確定")||s.Contains("断定")); Assert(s.Contains("正常や解決とはしません")); });
        Test("HRT unknown is inspect-only reason",()=>Assert(WildsProfile.Plan(Scan(),new WildsAnswers()).First(x=>x.Step.Id=="wilds-textures").Reason.Contains("見るだけ")));
        Test("HRT no does not suggest turning it off",()=>Assert(!WildsProfile.Plan(Scan(),new WildsAnswers { TexturePack=Answer.No }).Any(x=>x.Step.Id=="wilds-textures")));
        Test("purchased specs are not a preset diagnosis",()=>{ var s=Scan(); s.Wilds.InstalledRamMiB=32768; s.Hardware.LocalGpuNames.Add("Example high-end GPU"); Assert(!WildsProfile.Plan(s,new WildsAnswers()).Any(x=>x.Step.Id=="wilds-requirements")); });
        Test("RAM16GB not marked insufficient from visible reserve",()=>{ var s=Scan(); s.Wilds.InstalledRamMiB=16384; s.Hardware.TotalMemoryMiB=15900; Assert(!WildsProfile.Plan(s,new WildsAnswers()).Any(x=>x.Step.Id=="wilds-requirements")); });
        Test("unknown RAM not marked insufficient",()=>Assert(!WildsProfile.Plan(Scan(),new WildsAnswers()).Any(x=>x.Step.Id=="wilds-requirements")));
        Test("RAM8GB gets requirement check not definite cause",()=>{ var s=Scan(); s.Wilds.InstalledRamMiB=8192; Assert(WildsProfile.Plan(s,new WildsAnswers()).Any(x=>x.Step.Id=="wilds-requirements"&&x.Reason.Contains("可能性"))); });
        Test("new report privacy strings all excluded",()=>{ var s=Scan(); string bad=@"C:\Users\alice alice@example.com 192.168.1.123 76561198000000000 SERIALSECRET"; s.Wilds.GameVersionParts=new[]{-1}; s.Hardware.LocalCpuName=bad; s.Hardware.LocalGpuNames.Add(bad); string r=WildsProfile.Summary(s,new WildsAnswers(),new Dictionary<string,StepState>{{bad,StepState.Tried}}); Assert(!r.Contains("alice")&&!r.Contains("192.168.1.123")&&!r.Contains("76561198000000000")&&!r.Contains("SERIALSECRET")); });
        Test("CrashReport presence is not parsed evidence",()=>{ var s=Scan(); s.Wilds.CrashFolderPresent=true; s.Wilds.CrashFolderStatus=ReadStatus.Complete; s.Wilds.CrashFilesExamined=2; s.Wilds.CrashFilesInWindow=1; string r=WildsProfile.Summary(s,new WildsAnswers(),null); Assert(r.Contains("内容の追加解析は別枠")&&r.Contains("未確定")); });
        Test("CrashReport denied does not say absent",()=>{ var s=Scan(); s.Wilds.CrashFolderStatus=ReadStatus.AccessDenied; string r=WildsProfile.Summary(s,new WildsAnswers(),null); Assert(r.Contains("CrashReport: 判定できません")); });
        Test("partial compat does not claim no flags",()=>{ var s=Scan(); s.Wilds.CompatibilityStatus=ReadStatus.Partial; Assert(WildsProfile.Summary(s,new WildsAnswers(),null).Contains("ゲーム 未確認")); });
        Test("all Wilds URLs fixed HTTPS",()=>Assert(WildsProfile.Steps.All(x=>x.GuideUrl.StartsWith("https://gemnao.pages.dev/")&&x.OfficialUrl.StartsWith("https://"))));
        Test("Wilds action ids unique",()=>Assert(WildsProfile.Steps.Select(x=>x.Id).Distinct().Count()==WildsProfile.Steps.Length));
        Test("plan ids belong to fixed known actions",()=>{ foreach(LaunchStage st in Enum.GetValues(typeof(LaunchStage)))foreach(Answer a in Enum.GetValues(typeof(Answer)))Assert(WildsProfile.Plan(Scan(),new WildsAnswers { Stage=st,Mods=a,TexturePack=a }).All(x=>WildsProfile.Steps.Any(step=>step.Id==x.Step.Id))); });
        Test("generic report actions can be omitted",()=>Assert(!Rules.BuildReport(Scan(),null,TrialOutcome.NotTested,null,false).Contains("【手動の次の一歩】")));
        Test("cancelled capture cannot replace safety evidence",()=>{ var s=Scan(); Assert(!WildsProfile.AcceptsCapture(s,s.TargetSession,true)); });
        Test("wrong target capture cannot commit",()=>{ var s=Scan(); Assert(!WildsProfile.AcceptsCapture(s,Guid.NewGuid(),false)); });
        Test("successful same target capture accepted",()=>{ var s=Scan(); Assert(WildsProfile.AcceptsCapture(s,s.TargetSession,false)); });
        Test("missing capture cannot commit",()=>Assert(!WildsProfile.AcceptsCapture(null,Guid.NewGuid(),false)));
        Test("next action skips tried and skipped",()=>{ var p=WildsProfile.Plan(Scan(),new WildsAnswers()); var states=new Dictionary<string,StepState>(); states[p[0].Step.Id]=StepState.Tried; states[p[1].Step.Id]=StepState.Skipped; Assert(WildsProfile.NextUntried(p,states)==2); });
        Test("checked action remains eligible",()=>{ var p=WildsProfile.Plan(Scan(),new WildsAnswers()); var states=new Dictionary<string,StepState>{{p[0].Step.Id,StepState.Checked}}; Assert(WildsProfile.NextUntried(p,states)==0); });
        Test("exhausted actions signal escalation",()=>{ var p=WildsProfile.Plan(Scan(),new WildsAnswers()); Assert(WildsProfile.NextUntried(p,p.ToDictionary(x=>x.Step.Id,x=>StepState.Tried))==-1); });
        Test("safety stop cannot be skipped away",()=>{ var p=WildsProfile.Plan(Scan(),new WildsAnswers{WholePcIssue=Answer.Yes}); Assert(WildsProfile.NextUntried(p,p.ToDictionary(x=>x.Step.Id,x=>StepState.Skipped))==0); });
        Test("1000 malformed registration strings fail safely",()=>{var rng=new Random(917);for(int i=0;i<1000;i++){var chars=Enumerable.Range(0,rng.Next(1,700)).Select(x=>(char)rng.Next(0,128)).ToArray();try{SteamText.Parse(new string(chars));}catch(FormatException){}}});
    }
}
