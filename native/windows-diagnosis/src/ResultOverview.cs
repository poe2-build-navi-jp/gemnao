using System.Collections.Generic;
using System.Linq;

namespace Gemnao.Diagnostics
{
    // Display only. Does not change evidence, export fields or history schema.
    public static class ResultOverview
    {
        public static string Collection(LogFacts facts)
        {
            bool complete=facts.Status==ReadStatus.Complete && !facts.LimitReached && facts.Unsupported==0;
            string text=complete ? (facts.Events.Count==0 ? L.T("Result.Zero") : Rules.StatusText(facts.Status))
                : L.T("Result.Incomplete")+Rules.StatusText(facts.Status);
            if(facts.Events.Count>0)text+="\n"+string.Format(L.T("Result.Matches"),facts.Events.Count(x=>x.Match==MatchKind.ExactPath),facts.Events.Count(x=>x.Match==MatchKind.NameOnly));
            if(facts.OtherTarget>0)text+="\n"+L.T("Result.Other");
            return text;
        }
        public static ActionPlanItem Next(List<ActionPlanItem> plan, IDictionary<string,StepState> states)
        {
            // A safety stop remains visible even if marked tried or skipped.
            var stop=plan.FirstOrDefault(x=>x.Step.Id=="stop"||x.Step.Id=="wilds-stop");
            if(stop!=null)return stop;
            int index=WildsProfile.NextUntried(plan,states);
            return index<0?null:plan[index];
        }
        public static string Build(Snapshot snapshot, ActionPlanItem next)
        {
            return L.T("Result.Known")+"\n"+Collection(snapshot.Application)+"\n\n"+
                L.T("Result.Unknown")+"\n"+L.T("Result.Uncertain")+L.T("MainForm.153")+
                (GameProfile.IsPerformance(snapshot.Symptom)?"\n"+L.T("MainForm.151"):"")+
                (snapshot.Application.Events.Count==0?"\n"+L.T("Result.NoRecord"):"")+"\n\n"+
                L.T("Result.Next")+"\n"+(next==null?L.T("Result.NoNext")+L.T("MainForm.154"):next.Step.Title+"\n"+next.Step.Warning);
        }
    }
}
