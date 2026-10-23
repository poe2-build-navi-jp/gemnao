using System;
using System.Collections.Generic;
using Gemnao.Diagnostics;

internal static class CaptureWorkflowTests
{
    private static readonly DateTime Start = new DateTime(2026, 1, 1, 10, 0, 0, DateTimeKind.Utc);
    private static readonly Guid Target = Guid.NewGuid();
    private static void Assert(bool value) { if (!value) throw new Exception("Assertion failed"); }
    private static Snapshot Read(DateTime start, DateTime end)
    {
        var s = new Snapshot { StartUtc=start, EndUtc=end, CollectedUtc=end, TargetSession=Target };
        s.Application.Status=s.System.Status=ReadStatus.Complete; return s;
    }
    private static CaptureTransition Commit(Snapshot s, Snapshot previous=null, Snapshot baseline=null, CaptureMode mode=CaptureMode.InitialAttempt, TrialOutcome outcome=TrialOutcome.NotTested)
    {
        CaptureTransition r; Assert(CaptureWorkflow.TryCommit(s,previous,baseline,Target,false,mode,outcome,out r)); return r;
    }
    private static Snapshot Initial() { return Commit(Read(Start,Start.AddSeconds(12))).Current; }
    internal static void Run(Action<string,Action> Test)
    {
        Test("capture preserves caller session safety latch",()=>{var s=Read(Start,Start.AddSeconds(12));s.PriorRestartObserved=true;var c=Commit(s);Assert(c.Current.PriorRestartObserved&&!WildsProfile.MayRetest(c.Current,new WildsAnswers()));});
        Test("initial capture assigns a private attempt identity",()=> { var c=Commit(Read(Start,Start.AddSeconds(12))); Assert(c.Current.AttemptId!=Guid.Empty && c.Current.Origin==CaptureOrigin.TimedAttempt && c.Baseline==null && !c.PreserveStepRecords); });
        Test("recent window never claims one actual trial",()=> { var c=Commit(Read(Start,Start.AddMinutes(10)),mode:CaptureMode.InitialRecent); Assert(c.Current.Origin==CaptureOrigin.RecentWindow && CaptureWorkflow.Description(c.Current).Contains("複数")); });
        Test("delayed 12 second capture extends without new attempt",()=> { var old=Initial(); var c=Commit(Read(Start,Start.AddMinutes(4)),old,mode:CaptureMode.Refresh); Assert(c.Current.AttemptId==old.AttemptId && c.Current.StartUtc==old.StartUtc && c.Current.EndUtc==Start.AddMinutes(4) && c.Current.RefreshCount==1); });
        Test("refresh keeps baseline and user outcome",()=> { var first=Initial(); var second=Commit(Read(Start.AddMinutes(1),Start.AddMinutes(2)),first,mode:CaptureMode.Retest).Current; var c=Commit(Read(second.StartUtc,Start.AddMinutes(5)),second,first,CaptureMode.Refresh,TrialOutcome.Same); Assert(ReferenceEquals(c.Baseline,first) && c.Outcome==TrialOutcome.Same && c.PreserveStepRecords); });
        Test("repeated refresh never advances baseline",()=> { var first=Initial(); var second=Commit(Read(Start.AddMinutes(1),Start.AddMinutes(2)),first,mode:CaptureMode.Retest).Current; var a=Commit(Read(second.StartUtc,Start.AddMinutes(3)),second,first,CaptureMode.Refresh,TrialOutcome.Worse); var b=Commit(Read(second.StartUtc,Start.AddMinutes(4)),a.Current,a.Baseline,CaptureMode.Refresh,a.Outcome); Assert(ReferenceEquals(b.Baseline,first) && b.Current.AttemptId==second.AttemptId && b.Current.RefreshCount==2 && b.Outcome==TrialOutcome.Worse); });
        Test("refresh preserves tried steps eligibility",()=> { var old=Initial(); var c=Commit(Read(Start,Start.AddMinutes(4)),old,mode:CaptureMode.Refresh); var states=new Dictionary<string,StepState>{{"wilds-driver",StepState.Tried}}; if(!c.PreserveStepRecords)states.Clear(); Assert(states["wilds-driver"]==StepState.Tried); });
        Test("retest creates new attempt and previous baseline",()=> { var first=Initial(); var c=Commit(Read(Start.AddMinutes(1),Start.AddMinutes(2)),first,mode:CaptureMode.Retest,outcome:TrialOutcome.Better); Assert(c.Current.AttemptId!=first.AttemptId && ReferenceEquals(c.Baseline,first) && c.PreserveStepRecords && c.Outcome==TrialOutcome.NotTested && c.Current.RefreshCount==0); });
        Test("refresh after recent window keeps recent classification",()=> { var old=Commit(Read(Start,Start.AddMinutes(10)),mode:CaptureMode.InitialRecent).Current; var c=Commit(Read(Start,Start.AddMinutes(12)),old,mode:CaptureMode.Refresh); Assert(c.Current.Origin==CaptureOrigin.RecentWindow && CaptureWorkflow.Description(c.Current).Contains("新しい再テストではありません")); });
        Test("refresh exactly 30 minutes accepted",()=>Assert(CaptureWorkflow.CanRefresh(Initial(),Start.AddMinutes(30))));
        Test("refresh past 30 minutes refused without shifting start",()=>Assert(!CaptureWorkflow.CanRefresh(Initial(),Start.AddMinutes(30).AddTicks(1))));
        Test("refresh backward clock refused",()=>Assert(!CaptureWorkflow.CanRefresh(Initial(),Start.AddSeconds(11))));
        Test("refresh missing prior refused",()=>Assert(!CaptureWorkflow.CanRefresh(null,Start.AddMinutes(1))));
        Test("refresh non UTC refused",()=>Assert(!CaptureWorkflow.CanRefresh(Initial(),DateTime.SpecifyKind(Start.AddMinutes(1),DateTimeKind.Local))));
        Test("refresh changed start refused",()=> { var old=Initial(); CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(Read(Start.AddSeconds(1),Start.AddMinutes(2)),old,null,Target,false,CaptureMode.Refresh,TrialOutcome.Same,out c) && c==null); });
        Test("refresh wrong target refused",()=> { var old=Initial(); var s=Read(Start,Start.AddMinutes(2)); s.TargetSession=Guid.NewGuid(); CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(s,old,null,Target,false,CaptureMode.Refresh,TrialOutcome.Same,out c) && c==null); });
        Test("cancelled refresh has no commit or metadata changes",()=> { var old=Initial(); var s=Read(Start,Start.AddMinutes(2)); CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(s,old,null,Target,true,CaptureMode.Refresh,TrialOutcome.Same,out c) && c==null && s.AttemptId==Guid.Empty && old.RefreshCount==0); });
        Test("missing capture has no commit",()=> { CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(null,Initial(),null,Target,false,CaptureMode.Refresh,TrialOutcome.Same,out c) && c==null); });
        Test("existing attempt cannot silently become new initial",()=> { CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(Read(Start,Start.AddMinutes(10)),Initial(),null,Target,false,CaptureMode.InitialRecent,TrialOutcome.Same,out c)); });
        Test("refresh without attempt identity refused",()=> { CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(Read(Start,Start.AddMinutes(2)),Read(Start,Start.AddSeconds(12)),null,Target,false,CaptureMode.Refresh,TrialOutcome.Same,out c)); });
        Test("overlapping retest refused",()=> { var first=Initial(); CaptureTransition c; Assert(!CaptureWorkflow.TryCommit(Read(Start.AddSeconds(5),Start.AddMinutes(2)),first,null,Target,false,CaptureMode.Retest,TrialOutcome.Same,out c)); });
        Test("same attempt is not before after comparison",()=> { var old=Initial(); var c=Commit(Read(Start,Start.AddMinutes(3)),old,mode:CaptureMode.Refresh); Assert(Rules.Compare(old,c.Current,TrialOutcome.Better).Contains("新しい再テストではありません")); });
        Test("refresh retains prior safety stop when new read partial",()=> { var old=Initial(); old.System.Events.Add(new EventFact{Kind=EventKind.UncleanRestart}); var next=Read(Start,Start.AddMinutes(4)); next.System.Status=ReadStatus.AccessDenied; var c=Commit(next,old,mode:CaptureMode.Refresh); Assert(c.Current.PriorRestartObserved && c.Current.System.Events.Count==0 && !WildsProfile.MayRetest(c.Current,new WildsAnswers()) && WildsProfile.Plan(c.Current,new WildsAnswers())[0].Step.Id=="wilds-stop"); });
        Test("refresh does not duplicate old event counts",()=> { var old=Initial(); old.Application.Events.Add(new EventFact{Kind=EventKind.ApplicationCrash}); var c=Commit(Read(Start,Start.AddMinutes(4)),old,mode:CaptureMode.Refresh); Assert(c.Current.Application.Events.Count==0); });
        Test("private attempt identity not exported",()=> { var old=Initial(); string r=Rules.BuildReport(old,null,TrialOutcome.NotTested,null,false); Assert(!r.Contains(old.AttemptId.ToString()) && !r.Contains(Target.ToString())); });
        Test("unrecorded step not falsely declared unperformed",()=>Assert(Rules.StateText(StepState.NotStarted)=="実施の記録なし"));
        Test("footer describes limited dump scope consistently",()=> { string r=Rules.BuildReport(Initial(),null,TrialOutcome.NotTested,null,false); Assert(r.Contains("限定項目を解析") && r.Contains("メモリ内容・レジスタ・スタック・命令・シンボル解析は対象外") && !r.Contains("1001、ダンプ解析")); });
        Test("zero event hint says wait and no relaunch",()=>Assert(CaptureWorkflow.MissingRecordHint.Contains("生成中") && CaptureWorkflow.MissingRecordHint.Contains("起動し直さず") && CaptureWorkflow.FinishButtonText.Contains("生成完了")));
    }
}
