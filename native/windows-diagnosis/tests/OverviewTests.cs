using System;
using System.Collections.Generic;
using Gemnao.Diagnostics;

internal static class OverviewTests
{
    private static void Assert(bool ok) { if(!ok)throw new Exception("Overview assertion failed"); }
    public static void Run(Action<string,Action> test)
    {
        foreach(string language in new[]{"ja","en"})
        {
            L.SetLanguage(language);
            foreach(ReadStatus status in Enum.GetValues(typeof(ReadStatus)))
                test(language+" zero versus incomplete "+status,()=>{
                    var facts=new LogFacts{Status=status};string text=ResultOverview.Collection(facts);
                    Assert(text.Contains(L.T(status==ReadStatus.Complete?"Result.Zero":"Result.Incomplete")));
                    Assert(!text.Contains(L.T("Result.Other")));
                });
            test(language+" limits and unsupported never complete zero",()=>{
                Assert(!ResultOverview.Collection(new LogFacts{Status=ReadStatus.Complete,LimitReached=true}).Contains(L.T("Result.Zero")));
                Assert(!ResultOverview.Collection(new LogFacts{Status=ReadStatus.Complete,Unsupported=1}).Contains(L.T("Result.Zero")));
            });
            test(language+" evidence only other target and partial matches",()=>{
                var f=new LogFacts{Status=ReadStatus.AccessDenied,OtherTarget=1};f.Events.Add(new EventFact{Match=MatchKind.NameOnly});
                string text=ResultOverview.Collection(f);Assert(text.Contains(L.T("Result.Incomplete"))&&text.Contains(L.T("Result.Other")));
                Assert(text.Contains(string.Format(L.T("Result.Matches"),0,1)));
            });
            test(language+" safety stop survives skipped state",()=>{
                var stop=new ActionPlanItem{Step=new GuideStep{Id="stop",Title="stop",Warning="warning"}};
                Assert(ResultOverview.Next(new List<ActionPlanItem>{stop},new Dictionary<string,StepState>{{"stop",StepState.Skipped}})==stop);
                string text=ResultOverview.Build(new Snapshot(),stop);Assert(text.Contains("warning")&&text.Contains(L.T("Result.NoRecord")));
            });
            test(language+" unknown cause no raw paths or names",()=>{
                var s=new Snapshot();s.Hardware.LocalCpuName="SYNTHETIC_PRIVATE";s.Application.Status=ReadStatus.Complete;
                string text=ResultOverview.Build(s,null);Assert(!text.Contains("SYNTHETIC_PRIVATE")&&text.Contains(L.T("Result.Uncertain"))&&text.Contains(L.T("Result.NoNext")));
            });
        }
        test("reject exact helper names case insensitive, preserve game names",()=>{
            foreach(string name in new[]{"Steam.exe","CRASHREPORT.EXE","CrashReportClient.exe","steamwebhelper.exe"})
                Assert(!GameProfile.Accepts(@"C:\Games\"+name,GameKind.General));
            Assert(GameProfile.Accepts(@"C:\Games\SteamWorld.exe",GameKind.General));
            Assert(GameProfile.Accepts(@"C:\Games\MonsterHunterWilds.exe",GameKind.Wilds));
        });
        test("other target flag excludes out of window and unsupported",()=>{
            DateTime end=new DateTime(2026,10,2,5,0,0,DateTimeKind.Utc);EventFact fact;bool other;
            string xml="<Event xmlns='http://schemas.microsoft.com/win/2004/08/events/event'><System><Provider Name='Application Error'/><EventID>1000</EventID><TimeCreated SystemTime='2026-10-02T04:55:00Z'/><Channel>Application</Channel></System><EventData><Data Name='AppName'>other.exe</Data></EventData></Event>";
            Assert(Rules.ParseEvent(xml,@"C:\Games\game.exe",end.AddHours(-1),end,out fact,out other)==ParseOutcome.NotTarget && other);
            Rules.ParseEvent(xml,@"C:\Games\game.exe",end,end.AddMinutes(1),out fact,out other);Assert(!other);
            Rules.ParseEvent("invalid",@"C:\Games\game.exe",end.AddHours(-1),end,out fact,out other);Assert(!other);
        });
        L.SetLanguage("ja");
    }
}
