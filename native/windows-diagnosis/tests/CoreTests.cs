using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using Gemnao.Diagnostics;

internal static class CoreTests
{
    private static int passed, failed;
    private static readonly DateTime End = new DateTime(2026, 10, 2, 5, 0, 0, DateTimeKind.Utc);
    private static readonly string Target = @"C:\Games\Example\game.exe";
    private static void Test(string name, Action run)
    {
        try { run(); Console.WriteLine("PASS " + name); passed++; }
        catch (Exception e) { Console.WriteLine("FAIL " + name + ": " + e.Message); failed++; }
    }
    private static void Assert(bool condition, string text = "Assertion failed") { if (!condition) throw new Exception(text); }
    private static string Data(string key, string value) { return "<Data Name=\"" + key + "\">" + SecurityElement.Escape(value) + "</Data>"; }
    private static string Xml(string data, int id = 1000, string provider = "Application Error", string channel = "Application", string time = "2026-10-02T04:55:00.0000000Z")
    {
        return "<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"" + provider + "\"/><EventID>" + id + "</EventID><TimeCreated SystemTime=\"" + time + "\"/><Channel>" + channel + "</Channel><Computer>secret-user-pc</Computer><Security UserID=\"S-1-5-21-SECRET\"/></System><EventData>" + data + "</EventData></Event>";
    }
    private static ParseOutcome Parse(string xml, out EventFact e) { return Rules.ParseEvent(xml, Target, End.AddHours(-1), End, out e); }
    private static Snapshot Snapshot()
    {
        var s = new Snapshot { StartUtc = End.AddHours(-1), EndUtc = End, CollectedUtc = End, TargetSession = Guid.NewGuid() };
        s.Application.Status = s.System.Status = ReadStatus.Complete;
        return s;
    }
    private static string Report(Snapshot s) { return Rules.BuildReport(s, null, TrialOutcome.NotTested, new Dictionary<string, StepState>()); }
    private static int Main(string[] args)
    {
        L.SetLanguage("ja");
        if(args.Length==2 && args[0]=="--write-feedback-fixture")return ClientWorkflowTests.WriteFeedbackFixture(args[1]);
        if(args.Length==2 && args[0]=="--inspect-crash-archive")return EvidenceTests.Inspect(args[1]);
        Test("vendor Intel Corporation", () => Assert(Rules.Vendor("Intel Corporation") == "Intel"));
        Test("vendor Microsoft Corporation", () => Assert(Rules.Vendor("Microsoft Corporation") == "Microsoft"));
        Test("vendor NVIDIA Corporation", () => Assert(Rules.Vendor("NVIDIA Corporation") == "NVIDIA"));
        Test("vendor Advanced Micro Devices", () => Assert(Rules.Vendor("Advanced Micro Devices, Inc.") == "AMD"));
        Test("vendor ATI Technologies", () => Assert(Rules.Vendor("ATI Technologies Inc.") == "AMD"));
        Test("unknown corporation stays unknown", () => Assert(Rules.Vendor("Example Corporation") == "その他/不明"));
        Test("numeric driver version", () => Assert(Rules.NumericVersion("32.0.15.7283") == "32.0.15.7283"));
        Test("arbitrary driver text removed", () => Assert(Rules.NumericVersion("alice@example.com") == "不明"));
        Test("IPv4-shaped version removed", () => Assert(Rules.NumericVersion("192.168.1.123") == "不明"));
        Test("oversized numeric version removed", () => Assert(Rules.NumericVersion("123456789012345678.1234") == "不明"));
        Test("local EXE accepted", () => Assert(Rules.IsLocalExe(Target)));
        Test("UNC excluded", () => Assert(!Rules.IsLocalExe(@"\\server\private\game.exe")));
        Test("device paths excluded", () => Assert(!Rules.IsLocalExe(@"\\?\C:\game.exe")));
        Test("ADS excluded", () => Assert(!Rules.IsLocalExe(@"C:\folder:stream\game.exe")));
        Test("non exe excluded", () => Assert(!Rules.IsLocalExe(@"C:\game.ps1")));
        Test("good bounded time", () => Assert(Rules.ValidWindow(End.AddHours(-1), End, End)));
        Test("future time rejected", () => Assert(!Rules.ValidWindow(End, End.AddHours(1), End)));
        Test("more than 24h rejected", () => Assert(!Rules.ValidWindow(End.AddHours(-25), End, End)));
        Test("more than 7d old rejected", () => Assert(!Rules.ValidWindow(End.AddDays(-8), End.AddDays(-7), End)));
        Test("empty interval rejected", () => Assert(!Rules.ValidWindow(End, End, End)));
        Test("non UTC range rejected", () => Assert(!Rules.ValidWindow(DateTime.SpecifyKind(End.AddHours(-1), DateTimeKind.Local), End, End)));
        Test("application crash exact path", () => {
            EventFact e; Assert(Parse(Xml(Data("AppName", "game.exe") + Data("AppPath", Target) + Data("ModuleName", "ntdll.dll") + Data("ExceptionCode", "c0000005")), out e) == ParseOutcome.Accepted);
            Assert(e.Kind == EventKind.ApplicationCrash && e.Match == MatchKind.ExactPath && e.Module == ModuleKind.WindowsCore && e.ExceptionCode == "C0000005");
        });
        Test("path case-insensitive", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target.ToUpperInvariant())), out e) == ParseOutcome.Accepted); });
        Test("same basename different path excluded", () => { EventFact e; Assert(Parse(Xml(Data("AppName", "game.exe") + Data("AppPath", @"D:\Other\game.exe")), out e) == ParseOutcome.NotTarget); });
        Test("name-only match visibly weaker", () => { EventFact e; Assert(Parse(Xml(Data("AppName", "game.exe")), out e) == ParseOutcome.Accepted && e.Match == MatchKind.NameOnly); });
        Test("different app excluded", () => { EventFact e; Assert(Parse(Xml(Data("AppName", "other.exe")), out e) == ParseOutcome.NotTarget); });
        Test("missing application identifier unsupported", () => { EventFact e; Assert(Parse(Xml(Data("ModuleName", "ntdll.dll")), out e) == ParseOutcome.Unsupported); });
        Test("application hang ExeFileName", () => { EventFact e; Assert(Parse(Xml(Data("AppName", "game.exe") + Data("ExeFileName", Target), 1002, "Application Hang"), out e) == ParseOutcome.Accepted && e.Kind == EventKind.ApplicationHang); });
        Test("legacy unnamed fields unsupported safely", () => { EventFact e; Assert(Parse(Xml("<Data>game.exe</Data><Data>" + Target + "</Data>"), out e) == ParseOutcome.Unsupported); });
        Test("wrong provider unsupported", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target), 1000, "MaliciousProvider"), out e) == ParseOutcome.Unsupported); });
        Test("wrong channel unsupported", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target), 1000, "Application Error", "Security"), out e) == ParseOutcome.Unsupported); });
        Test("WER excluded", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target), 1001, "Windows Error Reporting"), out e) == ParseOutcome.Unsupported); });
        Test("kernel power is context only", () => { EventFact e; Assert(Parse(Xml("", 41, "Microsoft-Windows-Kernel-Power", "System"), out e) == ParseOutcome.Accepted && e.Match == MatchKind.SystemContext); });
        Test("display recovery is context only", () => { EventFact e; Assert(Parse(Xml("", 4101, "Display", "System"), out e) == ParseOutcome.Accepted && e.Match == MatchKind.SystemContext); });
        Test("outside window excluded", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target), time:"2026-10-02T03:00:00Z"), out e) == ParseOutcome.NotTarget); });
        Test("invalid timestamp unsupported", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target), time:"secret-email"), out e) == ParseOutcome.Unsupported); });
        Test("malformed XML rejected", () => { EventFact e; Assert(Parse("<Event><", out e) == ParseOutcome.Malformed && e == null); });
        Test("oversize XML rejected", () => { EventFact e; Assert(Parse(new string('x', 65537), out e) == ParseOutcome.Malformed); });
        Test("DTD external entity rejected without I/O", () => { EventFact e; Assert(Parse("<!DOCTYPE Event [<!ENTITY steal SYSTEM 'file:///etc/passwd'>]>" + Xml(Data("AppPath", Target)), out e) == ParseOutcome.Malformed); });
        Test("entity expansion rejected", () => { EventFact e; Assert(Parse("<!DOCTYPE Event [<!ENTITY x 'abc'>]>" + Xml(Data("AppPath", Target)).Replace(Target, "&x;"), out e) == ParseOutcome.Malformed); });
        Test("duplicate allowlist field rejected", () => { EventFact e; Assert(Parse(Xml(Data("AppPath", Target) + Data("AppPath", @"D:\Other\game.exe")), out e) == ParseOutcome.Unsupported); });
        Test("unknown module exported as class only", () => { EventFact e; Parse(Xml(Data("AppPath", Target) + Data("ModuleName", @"C:\Users\alice@example.com\76561198000000000.dll")), out e); Assert(e.Module == ModuleKind.Other); });
        Test("invalid exception text omitted", () => { EventFact e; Parse(Xml(Data("AppPath", Target) + Data("ExceptionCode", "192.168.1.123")), out e); Assert(e.ExceptionCode == ""); });
        Test("graphics known classification", () => Assert(Rules.ClassifyModule("nvwgf2umx.dll") == ModuleKind.Graphics));
        Test("runtime known classification", () => Assert(Rules.ClassifyModule("VCRUNTIME140.dll") == ModuleKind.VisualCpp));
        Test("no events is unknown not healthy", () => { string r = Report(Snapshot()); Assert(r.Contains("正常・解決を意味しません") && r.Contains("記録がありません")); });
        Test("access denied remains visible", () => { var s=Snapshot(); s.Application.Status=ReadStatus.AccessDenied; Assert(Report(s).Contains("アクセス拒否・昇格しません")); });
        Test("unavailable remains visible", () => { var s=Snapshot(); s.Hardware.GpuStatus=ReadStatus.Unavailable; Assert(Report(s).Contains("利用できません")); });
        Test("timed out remains visible", () => { var s=Snapshot(); s.Application.Status=ReadStatus.TimedOut; Assert(Report(s).Contains("時間上限・不完全")); });
        Test("cancelled remains visible", () => { var s=Snapshot(); s.Application.Status=ReadStatus.Cancelled; Assert(Report(s).Contains("中止・不完全")); });
        Test("limit reached remains visible", () => { var s=Snapshot(); s.Application.Status=ReadStatus.Partial; s.Application.LimitReached=true; s.Application.Examined=300; Assert(Report(s).Contains("上限 到達")); });
        Test("restart does not assert hardware cause", () => { var s=Snapshot(); s.System.Events.Add(new EventFact { Kind=EventKind.UncleanRestart, TimeUtc=End }); var f=Rules.Analyze(s).First(); Assert(f.StepId=="stop" && f.Unknown.Contains("この記録だけでは分かりません")); });
        Test("ntdll does not imply corrupt system files", () => { var s=Snapshot(); s.Application.Events.Add(new EventFact { Kind=EventKind.ApplicationCrash, Module=ModuleKind.WindowsCore, TimeUtc=End }); Assert(!Rules.Analyze(s).Any(f=>f.StepId=="runtime" || f.StepId=="graphics")); });
        Test("low disk threshold is candidate", () => { var s=Snapshot(); s.Hardware.Disks.Add(new DiskFact { TotalMiB=100000, FreeMiB=4000 }); Assert(Rules.Analyze(s).Any(f=>f.StepId=="space" && f.Unknown.Contains("判定していません"))); });
        Test("unknown disk not zero", () => { var s=Snapshot(); s.Hardware.Disks.Add(new DiskFact()); Assert(!Rules.Analyze(s).Any(f=>f.StepId=="space")); });
        Test("RAM snapshot not fault diagnosis", () => { var s=Snapshot(); s.Hardware.FreeMemoryMiB=500; Assert(Rules.Analyze(s).Any(f=>f.StepId=="memory" && f.Unknown.Contains("瞬間値"))); });
        Test("export closed projection and privacy attack", () => {
            var s=Snapshot();
            string[] secrets={@"C:\Users\alice", "alice@example.com", "192.168.1.123", "76561198000000000", "SERIALSECRET", "<script>", "secret-user-pc", "S-1-5-21-SECRET"};
            string hostile=string.Join(" ", secrets);
            s.Hardware.LocalCpuName=hostile; s.Hardware.LocalGpuNames.Add(hostile); s.Hardware.CpuVendor=hostile; s.Hardware.OsVersion=hostile;
            s.Hardware.Gpus.Add(new GpuFact { Vendor=hostile, DriverVersion=hostile });
            EventFact e; Parse(Xml(Data("AppPath", Target) + Data("ModuleName", hostile) + Data("ExceptionCode", hostile) + Data("Ignored", hostile)), out e); s.Application.Events.Add(e);
            string r=Report(s); foreach(string secret in secrets) Assert(!r.Contains(secret), "Leaked " + secret); Assert(!r.Contains(Target)); Assert(!r.Contains(s.TargetSession.ToString()));
        });
        Test("application basename containing identity never exported", () => {
            string p=@"C:\Games\alice@example.com.exe"; EventFact e;
            Assert(Rules.ParseEvent(Xml(Data("AppPath",p)+Data("AppName","alice@example.com.exe")),p,End.AddHours(-1),End,out e)==ParseOutcome.Accepted);
            var s=Snapshot(); s.Application.Events.Add(e); Assert(!Report(s).Contains("alice@example.com"));
        });
        Test("export does not contain absolute event time", () => Assert(!Report(Snapshot()).Contains("2026-10-02")));
        Test("missing comparison rejected", () => Assert(Rules.Compare(null,Snapshot(),TrialOutcome.NotTested).Contains("必要")));
        Test("different target rejected", () => Assert(Rules.Compare(Snapshot(),Snapshot(),TrialOutcome.Better).Contains("対象セッションが異なります")));
        Test("overlapping windows rejected", () => { var a=Snapshot(); var b=Snapshot(); b.TargetSession=a.TargetSession; Assert(Rules.Compare(a,b,TrialOutcome.Better).Contains("重なっています")); });
        Test("zero after not declared fixed", () => { var a=Snapshot(); var b=Snapshot(); b.TargetSession=a.TargetSession; b.StartUtc=End.AddMinutes(1); b.EndUtc=End.AddHours(1).AddMinutes(1); string r=Rules.Compare(a,b,TrialOutcome.Better); Assert(r.Contains("本人の申告") && r.Contains("解決の証明ではなく")); });
        Test("unequal windows explicitly qualified", () => { var a=Snapshot(); var b=Snapshot(); b.TargetSession=a.TargetSession; b.StartUtc=End.AddMinutes(1); b.EndUtc=End.AddMinutes(6); Assert(Rules.Compare(a,b,TrialOutcome.Same).Contains("観測時間が異なります")); });
        Test("partial comparison explicitly qualified", () => { var a=Snapshot(); var b=Snapshot(); b.TargetSession=a.TargetSession; b.StartUtc=End.AddMinutes(1); b.EndUtc=End.AddHours(1).AddMinutes(1); b.Application.Status=ReadStatus.AccessDenied; Assert(Rules.Compare(a,b,TrialOutcome.Unsure).Contains("増減を評価できません")); });
        Test("only known step status values exported", () => { var states=new Dictionary<string,StepState>(); states["alice@example.com"]=StepState.Tried; states["files"]=StepState.Checked; string r=Rules.BuildReport(Snapshot(),null,TrialOutcome.NotTested,states); Assert(!r.Contains("alice@example.com") && r.Contains("配布ファイルの検証手順を確認: 内容を確認")); });
        Test("all guide links are fixed HTTPS", () => Assert(Rules.Steps.All(x=>x.GuideUrl.StartsWith("https://gemnao.pages.dev/guide/") && x.OfficialUrl.StartsWith("https://") && !x.OfficialUrl.Contains("?"))));
        Test("export hard cap even if caller gives more events", () => { var s=Snapshot(); for(int i=0;i<1000;i++)s.Application.Events.Add(new EventFact { TimeUtc=End }); string r=Report(s); Assert(r.Split(new[]{"Application Error 1000"},StringSplitOptions.None).Length-1==Rules.MaxEventsPerLog); });
        // Deterministic randomized XML strings: parser must never execute or leak malformed input.
        Test("1000 malformed/untrusted fuzz cases do not throw", () => { var rng=new Random(521); for(int i=0;i<1000;i++){ var b=new StringBuilder(); for(int j=0;j<rng.Next(1,500);j++)b.Append((char)rng.Next(0,128)); EventFact e; Rules.ParseEvent(b.ToString(),Target,End.AddHours(-1),End,out e); } });
        WildsTests.Run(Test);
        CaptureWorkflowTests.Run(Test);
        ClientWorkflowTests.Run(Test);
        EvidenceTests.Run(Test);
        GeneralGameTests.Run(Test);
        LocalizationTests.Run(Test);
        Console.WriteLine("\n" + passed + " passed; " + failed + " failed. Synthetic fixtures; Windows collector/UI not executed.");
        return failed==0 ? 0 : 1;
    }
}
