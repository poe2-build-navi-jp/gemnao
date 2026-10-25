using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using Gemnao.Diagnostics;

internal static class EvidenceTests
{
    private static void Assert(bool value,string reason="Assertion failed"){if(!value)throw new Exception(reason);}
    private static Snapshot Scan(){return new Snapshot{StartUtc=new DateTime(2026,1,1,0,0,0,DateTimeKind.Utc),EndUtc=new DateTime(2026,1,1,0,5,0,DateTimeKind.Utc),TargetSession=Guid.NewGuid()};}
    private static EventFact Fact(string module="MonsterHunterWilds.exe",string path=@"C:\Games\MonsterHunterWilds.exe",string app="1.2.3.4",string mv="1.2.3.4",string offset="1234")
    {
        var e=new EventFact{Kind=EventKind.ApplicationCrash,Match=MatchKind.ExactPath,ExceptionCode="C0000005"};
        CrashDetails.Attach(e,@"C:\Games\MonsterHunterWilds.exe",module,path,app,mv,offset);return e;
    }
    private static byte[] Zip(params KeyValuePair<string,byte[]>[] entries)
    {
        using(var m=new MemoryStream()){using(var z=new ZipArchive(m,ZipArchiveMode.Create,true))foreach(var e in entries){var f=z.CreateEntry(e.Key,CompressionLevel.Optimal);using(var s=f.Open())s.Write(e.Value,0,e.Value.Length);}return m.ToArray();}
    }
    private static KeyValuePair<string,byte[]> Text(string text){return new KeyValuePair<string,byte[]>("CrashReport.txt",Encoding.UTF8.GetBytes(text));}
    private static string ValidText="[Steam Install Folder]\nC:\\Users\\private-person\\Steam\n[Process Information]\nExceptionCode : C0000005(EXCEPTION_ACCESS_VIOLATION)\nMode : ~ RUNASADMIN\nCommand Line : private@example.com\n[CPU Supported Instructions]\nAVX2\n";
    private static void W32(byte[] b,int p,uint n){Array.Copy(BitConverter.GetBytes(n),0,b,p,4);}
    private static void W64(byte[] b,int p,ulong n){Array.Copy(BitConverter.GetBytes(n),0,b,p,8);}
    private static byte[] Dump(uint code=0xc0000005,uint offset=0x1234)
    {
        var b=new byte[1024];W32(b,0,0x504d444d);W32(b,4,0xa793);W32(b,8,2);W32(b,12,32);W32(b,20,1767225720);
        W32(b,32,4);W32(b,36,112);W32(b,40,64);W32(b,44,6);W32(b,48,168);W32(b,52,176);
        W32(b,64,1);W64(b,68,0x140000000);W32(b,76,0x1000000);W32(b,88,344);W32(b,92,0xfeef04bd);W32(b,100,0x00010002);W32(b,104,0x00030004);
        W32(b,184,code);W64(b,200,0x140000000UL+offset);W32(b,208,0);
        byte[] name=Encoding.Unicode.GetBytes(@"C:\Users\private-person\Games\MonsterHunterWilds.exe");W32(b,344,(uint)name.Length);Array.Copy(name,0,b,348,name.Length);return b;
    }
    private static CrashArchiveFacts FromDump(byte[] d){return CrashArchive.Read(Zip(Text(ValidText),new KeyValuePair<string,byte[]>("MiniDump.dmp",d)));}
    private static byte[] DumpWithClientModule(string path)
    {
        var b=new byte[2048];W32(b,0,0x504d444d);W32(b,4,0xa793);W32(b,8,2);W32(b,12,32);W32(b,20,1767225720);
        W32(b,32,4);W32(b,36,220);W32(b,40,64);W32(b,44,6);W32(b,48,168);W32(b,52,320);W32(b,64,2);
        W64(b,68,0x140000000);W32(b,76,0x1000000);W32(b,88,600);W32(b,92,0xfeef04bd);W32(b,100,0x00010002);W32(b,104,0x00030004);
        W64(b,176,0x7ff000000000);W32(b,184,0x10000);W32(b,196,800);W32(b,200,0xfeef04bd);W32(b,208,0x00010000);
        W32(b,328,0xc0000005);W64(b,344,0x140001234);W32(b,352,0);
        foreach(var item in new[]{Tuple.Create(600,@"C:\Games\MonsterHunterWilds.exe"),Tuple.Create(800,path)}){byte[] name=Encoding.Unicode.GetBytes(item.Item2);W32(b,item.Item1,(uint)name.Length);Array.Copy(name,0,b,item.Item1+4,name.Length);}return b;
    }
    internal static void Run(Action<string,Action> Test)
    {
        Test("game dump client module context requires optional scope",()=>{var f=CrashArchive.Read(Zip(new KeyValuePair<string,byte[]>("MiniDump.dmp",DumpWithClientModule(@"D:\Steam\dwmapi.dll"))));Assert(f.DumpRead&&!f.ClientModulesChecked&&f.GameClientModules.Count==0);});
        Test("game dump Steam-root module distinct from live Steam",()=>{var f=CrashArchive.Read(Zip(new KeyValuePair<string,byte[]>("MiniDump.dmp",DumpWithClientModule(@"D:\Steam\dwmapi.dll"))),new SteamModuleContext{SteamRoot=@"D:\Steam",WindowsSystem=@"C:\Windows\System32"});Assert(f.DumpRead&&f.ClientModulesChecked&&f.GameClientModules.Single().Location==ModuleLocation.SteamRoot&&CrashArchive.Summary(f,Scan()).Contains("現在のSteamプロセスとは別"));});
        Test("game dump Windows module not Steam-root module",()=>{var f=CrashArchive.Read(Zip(new KeyValuePair<string,byte[]>("MiniDump.dmp",DumpWithClientModule(@"C:\Windows\System32\dwmapi.dll"))),new SteamModuleContext{SteamRoot=@"D:\Steam",WindowsSystem=@"C:\Windows\System32"});Assert(f.GameClientModules.Single().Location==ModuleLocation.WindowsSystem);});
        Test("game dump unknown client name never retained",()=>{var f=CrashArchive.Read(Zip(new KeyValuePair<string,byte[]>("MiniDump.dmp",DumpWithClientModule(@"C:\Users\private-person\private-person.dll"))),new SteamModuleContext{SteamRoot=@"D:\Steam"});Assert(f.DumpRead&&f.GameClientModules.Count==0&&!CrashArchive.Summary(f,Scan()).Contains("private-person"));});
        Test("event versions accept normal low quad",()=>Assert(CrashDetails.VersionText(CrashDetails.VersionParts("1.2.3.4"))=="1 / 2 / 3 / 4"));
        Test("event versions reject private text",()=>Assert(CrashDetails.VersionParts("alice@example.com").Length==0));
        Test("event versions reject extra/fewer pieces",()=>Assert(CrashDetails.VersionParts("1.2.3").Length==0&&CrashDetails.VersionParts("1.2.3.4.5").Length==0));
        Test("event versions reject overflow",()=>Assert(CrashDetails.VersionParts("1.2.65536.0").Length==0));
        Test("offset normalizes prefix and padding",()=>Assert(CrashDetails.Offset("0X00001234")==CrashDetails.Offset("1234")));
        Test("offset rejects paths and overflow",()=>Assert(CrashDetails.Offset(@"C:\Users\private")==null&&CrashDetails.Offset("12345678901234567")==null));
        Test("max 64bit offset safe",()=>Assert(CrashDetails.Offset("FFFFFFFFFFFFFFFF")==ulong.MaxValue));
        Test("exception uppercase prefix accepted",()=>Assert(CrashDetails.Exception("0XC0000005")=="C0000005"));
        Test("exception rejects injection",()=>Assert(CrashDetails.Exception("C0000005\nsecret")==""));
        Test("module actual target path distinguished",()=>Assert(Fact().Module==ModuleKind.TargetExecutable&&Fact().ModuleTargetMatch==MatchKind.ExactPath));
        Test("same target name other module path not called target",()=>Assert(Fact(path:@"D:\Other\MonsterHunterWilds.exe").Module!=ModuleKind.TargetExecutable));
        Test("target module missing path qualified",()=>Assert(Fact(path:null).ModuleTargetMatch==MatchKind.NameOnly&&CrashDetails.ModuleText(Fact(path:null)).Contains("未確認")));
        Test("module basename controls rejected",()=>Assert(CrashDetails.LocalBasename("private\u202E.dll")==""));
        Test("module no path reaches local display",()=>Assert(CrashDetails.LocalBasename(@"C:\Users\private\custom.dll")=="custom.dll"));
        Test("complete signature requires app exact path",()=>{var e=Fact();e.Match=MatchKind.NameOnly;Assert(!CrashDetails.CompleteSignature(e));});
        Test("literal unknown XML accepted as event but not fingerprint",()=>{var s=Scan();string xml="<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Application Error\"/><EventID>1000</EventID><Channel>Application</Channel><TimeCreated SystemTime=\"2026-01-01T00:01:00Z\"/></System><EventData><Data Name=\"AppPath\">C:\\Games\\MonsterHunterWilds.exe</Data><Data Name=\"ModuleName\">unknown</Data><Data Name=\"ModulePath\">unknown</Data><Data Name=\"AppVersion\">1.2.3.4</Data><Data Name=\"ModuleVersion\">0.0.0.0</Data><Data Name=\"ExceptionCode\">C0000005</Data><Data Name=\"FaultingOffset\">0</Data></EventData></Event>";EventFact f;Assert(Rules.ParseEvent(xml,@"C:\Games\MonsterHunterWilds.exe",s.StartUtc,s.EndUtc,out f)==ParseOutcome.Accepted&&f.Match==MatchKind.ExactPath&&f.ModuleNameUnavailable&&!CrashDetails.CompleteSignature(f));});
        Test("literal unknown module is missing identity not named DLL",()=>{var e=Fact("unknown","unknown",mv:"0.0.0.0",offset:"0");Assert(e.ModuleNameUnavailable&&e.Module==ModuleKind.Unknown&&e.ModuleIdentityToken==""&&!CrashDetails.CompleteSignature(e)&&e.ModuleVersionParts.SequenceEqual(new[]{0,0,0,0})&&e.FaultOffset==0);});
        Test("unknown module sentinel case insensitive trimmed",()=>Assert(!CrashDetails.CompleteSignature(Fact("  UNKNOWN  ","unknown"))));
        Test("unknown sentinel never forms P01 with zero placeholders",()=>{var s=Scan();s.Application.Events.Add(Fact("unknown","unknown",mv:"0.0.0.0",offset:"0"));s.Application.Events.Add(Fact("unknown","unknown",mv:"0.0.0.0",offset:"0"));string r=CrashDetails.PatternReport(s,null);Assert(!r.Contains("P01:")&&r.Contains("識別情報の欠落")&&r.Contains("項目不足"));});
        Test("named unknown dll remains a real private identity",()=>{var e=Fact("unknown.dll",@"C:\Games\unknown.dll");Assert(!e.ModuleNameUnavailable&&CrashDetails.CompleteSignature(e)&&e.Module==ModuleKind.Other);});
        Test("known module with unknown path uses name identity",()=>{var a=Fact("ntdll.dll","unknown");var b=Fact("kernelbase.dll","unknown");Assert(a.ModuleIdentityToken!=b.ModuleIdentityToken&&CrashDetails.CompleteSignature(a)&&CrashDetails.CompleteSignature(b));});
        Test("unknown sentinel does not become identity from supplied path",()=>Assert(!CrashDetails.CompleteSignature(Fact("unknown",@"C:\Games\custom.dll"))));
        Test("unknown sentinel classification can be exported safely",()=>{var e=Fact("unknown","unknown",mv:"0.0.0.0",offset:"0");Assert(CrashDetails.ModuleText(e,true).Contains("記録上不明")&&!CrashDetails.ModuleText(e,true).Contains("未知のモジュール"));});
        Test("missing module version not complete",()=>Assert(!CrashDetails.CompleteSignature(Fact(mv:null))));
        Test("three matching observations form one pattern",()=>{var s=Scan();for(int i=0;i<3;i++)s.Application.Events.Add(Fact());string r=CrashDetails.PatternReport(s,null);Assert(r.Contains("一致する記録 3件")&&!r.Contains("P02:"));});
        Test("different offset different pattern",()=>{var s=Scan();s.Application.Events.Add(Fact());s.Application.Events.Add(Fact(offset:"2345"));Assert(CrashDetails.PatternReport(s,null).Contains("P02:"));});
        Test("changed version not same position diagnosis",()=>{var s=Scan();s.Application.Events.Add(Fact());s.Application.Events.Add(Fact(app:"2.2.3.4"));Assert(CrashDetails.PatternReport(s,null).Contains("P02:"));});
        Test("same basename different module location separate",()=>{var s=Scan();s.Application.Events.Add(Fact("custom.dll",@"C:\one\custom.dll"));s.Application.Events.Add(Fact("custom.dll",@"C:\two\custom.dll"));Assert(CrashDetails.PatternReport(s,null).Contains("P02:"));});
        Test("incomplete data is not grouped by C0000005 alone",()=>{var s=Scan();s.Application.Events.Add(Fact(mv:null));string r=CrashDetails.PatternReport(s,null);Assert(!r.Contains("P01:")&&r.Contains("項目不足"));});
        Test("unknown names private even known-name optin",()=>{var s=Scan();s.Application.Events.Add(Fact("private-person.dll",@"C:\Users\private-person\private-person.dll"));string r=Rules.BuildReport(s,null,TrialOutcome.NotTested,null,false,true);Assert(!r.Contains("private-person")&&!r.Contains("C:\\"));});
        Test("known name export optin only",()=>{var e=Fact("ntdll.dll",@"C:\Windows\System32\ntdll.dll");Assert(!CrashDetails.ModuleText(e).Contains("ntdll.dll")&&CrashDetails.ModuleText(e,true).Contains("ntdll.dll"));});
        Test("exact app match has no contradictory same-name warning",()=>{var s=Scan();s.Application.Events.Add(Fact());Assert(!Rules.Analyze(s).Any(x=>x.Unknown.Contains("同名")||x.Unknown.Contains("名前のみ")));});
        Test("weak app match has correct warning",()=>{var s=Scan();var e=Fact();e.Match=MatchKind.NameOnly;s.Application.Events.Add(e);Assert(Rules.Analyze(s).Any(x=>x.Unknown.Contains("名前のみ")));});
        Test("archive known text exact fields only",()=>{var f=CrashArchive.Read(Zip(Text(ValidText)));Assert(f.TextRead&&f.TextException=="C0000005"&&f.TextAdminFlag);Assert(!CrashArchive.Summary(f,Scan()).Contains("private-person"));});
        Test("archive text-only timing remains unknown",()=>Assert(CrashArchive.Summary(CrashArchive.Read(Zip(Text(ValidText))),Scan()).Contains("テキストだけでは生成時刻")));
        Test("rejected partial text doesn't retain illegal instruction",()=>{var f=CrashArchive.Read(Zip(Text(ValidText.Replace("C0000005(EXCEPTION_ACCESS_VIOLATION)","C000001D(EXCEPTION_ILLEGAL_INSTRUCTION)").Replace("Mode :", "ExceptionCode : bad\nMode :"))));Assert(!f.TextRead&&f.TextException==""&&!CrashArchive.Summary(f,Scan()).Contains("不正命令例外"));});
        Test("archive traversal rejected",()=>Assert(CrashArchive.Read(Zip(Text(ValidText),new KeyValuePair<string,byte[]>("../evil.txt",new byte[]{1}))).Status==ArchiveStatus.Rejected));
        Test("archive Windows traversal rejected",()=>Assert(CrashArchive.Read(Zip(Text(ValidText),new KeyValuePair<string,byte[]>(@"C:\evil.txt",new byte[]{1}))).Status==ArchiveStatus.Rejected));
        Test("archive duplicate case names rejected",()=>Assert(CrashArchive.Read(Zip(Text(ValidText),new KeyValuePair<string,byte[]>("crashreport.TXT",Encoding.UTF8.GetBytes(ValidText)))).Status==ArchiveStatus.Rejected));
        Test("archive too many entries rejected",()=>Assert(CrashArchive.Read(Zip(Enumerable.Range(0,17).Select(x=>new KeyValuePair<string,byte[]>(x+".txt",new byte[0])).ToArray())).Status==ArchiveStatus.Rejected));
        Test("archive compressed bytes bound",()=>Assert(CrashArchive.Read(new byte[CrashArchive.MaxZip+1]).Status==ArchiveStatus.Rejected));
        Test("archive compression bomb ratio rejected",()=>Assert(CrashArchive.Read(Zip(new KeyValuePair<string,byte[]>("CrashReport.txt",new byte[1000000]))).Status==ArchiveStatus.Rejected));
        Test("archive unsupported compression rejected",()=>{var b=Zip(Text(ValidText));for(int p=0;p<b.Length-46;p++)if(BitConverter.ToUInt32(b,p)==0x02014b50){b[p+10]=99;break;}Assert(CrashArchive.Read(b).Status==ArchiveStatus.Rejected);});
        Test("encrypted ZIP rejected before entry reads",()=>{var b=Zip(Text(ValidText));for(int p=0;p<b.Length-46;p++)if(BitConverter.ToUInt32(b,p)==0x02014b50){b[p+8]|=1;break;}Assert(CrashArchive.Read(b).Status==ArchiveStatus.Rejected);});
        Test("minidump module exception correctly mapped",()=>{var f=FromDump(Dump());Assert(f.DumpRead&&f.DumpException=="C0000005"&&f.Fault.FaultOffset==0x1234&&f.Fault.AppVersionParts.SequenceEqual(new[]{1,2,3,4}));});
        Test("minidump maps illegal exception without CPU fault claim",()=>{var f=FromDump(Dump(0xc000001d));Assert(f.DumpRead&&CrashArchive.Summary(f,Scan()).Contains("CPUが要件不足/故障とは限らず"));});
        Test("minidump outside observation not merged",()=>{var f=FromDump(Dump());var s=Scan();s.StartUtc=s.StartUtc.AddDays(1);s.EndUtc=s.EndUtc.AddDays(1);Assert(CrashArchive.Summary(f,s).Contains("観測範囲外"));});
        Test("minidump text mismatch distinct",()=>Assert(CrashArchive.Summary(FromDump(Dump(0xc000001d)),Scan()).Contains("テキストとダンプの例外コードも異なります")));
        Test("dump path match doesn't imply selected identity",()=>Assert(CrashArchive.Summary(FromDump(Dump()),Scan()).Contains("選択中EXEとの同一性は未検証")));
        Test("unknown minidump version unsupported",()=>{var d=Dump();W32(d,4,123);Assert(!FromDump(d).DumpRead);});
        Test("minidump directory out of bounds safe",()=>{var d=Dump();W32(d,12,0xfffffff0);Assert(!FromDump(d).DumpRead);});
        Test("minidump excessive module count safe",()=>{var d=Dump();W32(d,64,10000);Assert(!FromDump(d).DumpRead);});
        Test("minidump oversized names rejected",()=>{var d=Dump();W32(d,344,5000);Assert(!FromDump(d).DumpRead);});
        Test("minidump module range overflow rejected",()=>{var d=Dump();W64(d,68,ulong.MaxValue-1);Assert(!FromDump(d).DumpRead);});
        Test("minidump absolute address not exported",()=>{string r=CrashArchive.Summary(FromDump(Dump()),Scan());Assert(!r.Contains("140001234")&&!r.Contains("private-person"));});
        Test("minidump uncontained address remains unknown",()=>{var f=FromDump(Dump(offset:0x2000000));Assert(f.DumpRead&&!f.Fault.FaultOffset.HasValue);});
        Test("closed trace metadata ignores random string",()=>Assert(TraceEvidence.ProductMarker("private@example.com",null)==ProductMark.None));
        Test("trace product marker exact match only",()=>Assert(TraceEvidence.ProductMarker("NotReShade",null)==ProductMark.None&&TraceEvidence.ProductMarker("ReShade",null)==ProductMark.ReShade));
        Test("file-name existence not MOD conviction",()=>{var s=Scan();s.Wilds.Traces.Add(new TraceFact{Id=TraceId.DxgiProxy,State=TraceState.Present});string r=TraceEvidence.Summary(s,new WildsAnswers{Mods=Answer.No});Assert(r.Contains("DLL名だけでMODと断定せず"));});
        Test("no traces doesn't prove never installed",()=>Assert(TraceEvidence.Summary(Scan(),new WildsAnswers()).Contains("一度も入れたことがない")));
        Test("LastPlayed formats only not successful play",()=>Assert(TraceEvidence.LaunchHistory("\"AppState\" { \"appid\" \"2246340\" \"LastPlayed\" \"1700000000\" }",Scan().EndUtc)==LaunchHistoryKind.TimestampValue));
        Test("LastPlayed absent never means never played",()=>Assert(TraceEvidence.LaunchHistory("\"AppState\" { \"appid\" \"2246340\" }",Scan().EndUtc)==LaunchHistoryKind.NoUsefulValue));
        Test("LastOwner not used as history",()=>Assert(TraceEvidence.LaunchHistory("\"AppState\" { \"appid\" \"2246340\" \"LastOwner\" \"1700000000\" }",Scan().EndUtc)==LaunchHistoryKind.NoUsefulValue));
        Test("SteamID-shaped LastPlayed rejected",()=>Assert(TraceEvidence.LaunchHistory("\"AppState\" { \"appid\" \"2246340\" \"LastPlayed\" \"76561198000000000\" }",Scan().EndUtc)==LaunchHistoryKind.Invalid));
        Test("demo success not retail success",()=>{string r=TraceEvidence.Summary(Scan(),new WildsAnswers{DemoWorked=Answer.Yes,WorkedBefore=Answer.No});Assert(r.Contains("体験版の成功は現在の製品版の成功/互換性の証明ではありません"));});
        Test("capture isolation only when reported yes",()=>Assert(!WildsProfile.Plan(Scan(),new WildsAnswers{CaptureTools=Answer.No}).Any(x=>x.Step.Id=="wilds-capture")&&WildsProfile.Plan(Scan(),new WildsAnswers{CaptureTools=Answer.Yes}).Any(x=>x.Step.Id=="wilds-capture")));
        Test("declined MOD plus no trace not removal advice",()=>{var s=Scan();s.Wilds.TraceStatus=ReadStatus.Complete;Assert(!WildsProfile.Plan(s,new WildsAnswers{Mods=Answer.No}).Any(x=>x.Step.Id=="wilds-mods"||x.Step.Id=="wilds-traces"));});
        Test("ZIP Unix symlink entry rejected",()=>{var b=Zip(Text(ValidText));for(int p=0;p<b.Length-46;p++)if(BitConverter.ToUInt32(b,p)==0x02014b50){W32(b,p+38,0xA0000000);break;}Assert(CrashArchive.Read(b).Status==ArchiveStatus.Rejected);});
        Test("understated decompressed size never accepted",()=>{var b=Zip(Text(ValidText));for(int p=0;p<b.Length-46;p++)if(BitConverter.ToUInt32(b,p)==0x02014b50){W32(b,p+24,1);break;}Assert(!CrashArchive.Read(b).TextRead);});
        Test("1000 parser keeps new selected fields",()=>{var s=Scan();string xml="<Event xmlns=\"http://schemas.microsoft.com/win/2004/08/events/event\"><System><Provider Name=\"Application Error\"/><EventID>1000</EventID><Channel>Application</Channel><TimeCreated SystemTime=\"2026-01-01T00:01:00Z\"/></System><EventData><Data Name=\"AppPath\">C:\\Games\\MonsterHunterWilds.exe</Data><Data Name=\"ModuleName\">MonsterHunterWilds.exe</Data><Data Name=\"ModulePath\">C:\\Games\\MonsterHunterWilds.exe</Data><Data Name=\"AppVersion\">1.2.3.4</Data><Data Name=\"ModuleVersion\">1.2.3.4</Data><Data Name=\"ExceptionCode\">C0000005</Data><Data Name=\"FaultingOffset\">00001234</Data></EventData></Event>";EventFact f;Assert(Rules.ParseEvent(xml,@"C:\Games\MonsterHunterWilds.exe",s.StartUtc,s.EndUtc,out f)==ParseOutcome.Accepted&&CrashDetails.CompleteSignature(f)&&f.FaultOffset==0x1234);});
        Test("admin flag gets manual inspection not auto elevation",()=>{var s=Scan();s.Wilds.GameAdminFlag=true;var p=WildsProfile.Plan(s,new WildsAnswers());Assert(p.First().Step.Id=="wilds-admin-flag"&&p.First().Step.Warning.Contains("管理者昇格はしません"));});
        Test("failed completed capture step skipped in next action",()=>{var s=Scan();var p=WildsProfile.Plan(s,new WildsAnswers{CaptureTools=Answer.Yes,Mods=Answer.No,TexturePack=Answer.No,Verification=VerifyResult.NoFilesReacquired});var done=new Dictionary<string,StepState>{{"wilds-capture",StepState.Tried}};Assert(p[WildsProfile.NextUntried(p,done)].Step.Id!="wilds-capture");});
        Test("500 random zip payloads safely rejected",()=>{var r=new Random(311);for(int i=0;i<500;i++){var b=new byte[r.Next(1,2000)];r.NextBytes(b);Assert(CrashArchive.Read(b).Status==ArchiveStatus.Rejected);}});
    }
    internal static int Inspect(string path)
    {
        if(new FileInfo(path).Length>CrashArchive.MaxZip)throw new Exception("Too large");
        var facts=CrashArchive.Read(File.ReadAllBytes(path));Console.WriteLine(CrashArchive.Summary(facts,Scan()));
        return facts.DumpRead&&facts.TextRead?0:1;
    }
}
