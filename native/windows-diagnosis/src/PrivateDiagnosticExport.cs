using System;
using System.Linq;
using System.Text;
namespace Gemnao.Diagnostics
{
    // Closed projection; never serialize Snapshot or append free text/local identifiers.
    public static class PrivateDiagnosticExport
    {
        public const string PageUrl="https://gemnao.pages.dev/private-diagnostic";
        private static string Status(ReadStatus value)
        {
            if(!Enum.IsDefined(typeof(ReadStatus),value))throw new FormatException();
            return new[]{"not-read","complete","access-denied","unavailable","timed-out","partial","cancelled"}[(int)value];
        }
        private static string Bool(bool value){return value?"true":"false";}
        public static string Build(Snapshot snapshot,WildsAnswers answers,TrialOutcome trial,string nextStep=null)
        {
            if(snapshot==null||answers==null||!Enum.IsDefined(typeof(GameKind),snapshot.Game)||!Enum.IsDefined(typeof(GameSymptom),snapshot.Symptom)||!Enum.IsDefined(typeof(Answer),answers.WholePcIssue)||!Enum.IsDefined(typeof(TrialOutcome),trial)||!FeedbackExport.ValidVersion(Rules.Version))throw new FormatException();
            if(nextStep!=null&&!GameProfile.AllSteps.Any(x=>x.Id==nextStep))throw new FormatException();
            var a=snapshot.Application;
            int exact=a.Events.Count(x=>x.Match==MatchKind.ExactPath),name=a.Events.Count(x=>x.Match==MatchKind.NameOnly);
            if(new[]{exact,name,a.OtherTarget,a.Examined,a.Unsupported}.Any(n=>n<0||n>Rules.MaxEventsPerLog)||exact+name+a.OtherTarget+a.Unsupported>a.Examined||(a.Status==ReadStatus.Complete&&(a.LimitReached||a.Unsupported>0)))throw new FormatException();
            string text="{\n  \"schema_version\": 1,\n  \"kind\": \"private-diagnostic\",\n  \"tool_version\": \""+Rules.Version+"\",\n  \"game\": \""+(snapshot.Game==GameKind.Wilds?"wilds":"general")+"\",\n  \"symptom\": \""+new[]{"launch","crash","black-screen","freeze","low-fps","stutter","other"}[(int)snapshot.Symptom]+"\",\n  \"observed\": {\n    \"application\": {\"status\":\""+Status(a.Status)+"\",\"exact_matches\":"+exact+",\"name_matches\":"+name+",\"other_target_records\":"+a.OtherTarget+",\"examined\":"+a.Examined+",\"unsupported\":"+a.Unsupported+",\"limit_reached\":"+Bool(a.LimitReached)+"},\n    \"system\": {\"status\":\""+Status(snapshot.System.Status)+"\",\"restart_record\":"+Bool(snapshot.System.Events.Any(e=>e.Kind==EventKind.UncleanRestart))+",\"display_record\":"+Bool(snapshot.System.Events.Any(e=>e.Kind==EventKind.DisplayRecovery))+"}\n  },\n  \"self_report\": {\"whole_pc_issue\":\""+new[]{"unknown","no","yes"}[(int)answers.WholePcIssue]+"\",\"trial\":\""+new[]{"not-tested","better","same","worse","unsure"}[(int)trial]+"\"}\n}\n";
            text=text.Substring(0,text.Length-3)+",\n  \"next_step\": "+(nextStep==null?"null":"\""+nextStep+"\"")+"\n}\n";
            if(Encoding.UTF8.GetByteCount(text)>4096)throw new FormatException();return text;
        }
    }
}
