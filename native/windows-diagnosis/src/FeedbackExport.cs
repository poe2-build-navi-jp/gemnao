using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Gemnao.Diagnostics
{
    public static class FeedbackExport
    {
        public const int SchemaVersion=1,MaxBytes=4096;
        public const string RuleVersion="0.6.0";
        // Only change after the owner verifies the public page and its operational privacy gates.
        public const bool PublicIntakeVerified=false;
        public const string PageUrl="https://gemnao.pages.dev/diagnostic-feedback";
        public static readonly string[] AllowedActions={"wilds-files","wilds-driver","wilds-capture","wilds-admin-flag","wilds-compatibility","wilds-mods","wilds-traces","wilds-textures","wilds-security","wilds-requirements","wilds-records","wilds-stop","wilds-steam-client-review"};
        public static bool ValidVersion(string value){return value!=null&&value.Length<=23&&Regex.IsMatch(value,@"\A[0-9]{1,5}(\.[0-9]{1,5}){0,3}\z");}
        public static string Outcome(ActionOutcome value)
        {
            switch(value){case ActionOutcome.Resolved:return "resolved";case ActionOutcome.Improved:return "improved";case ActionOutcome.Unchanged:return "unchanged";case ActionOutcome.Worse:return "worse";case ActionOutcome.NotTried:return "not-tried";default:return "unknown";}
        }
        public static readonly string[] Symptoms={"unknown","launch-crash","black-screen","graphics-error","shader-preparation","in-game-crash"};
        public static string Build(IList<ActionRecord> selected,Snapshot snapshot,bool includeEnvironment,string symptom="unknown")
        {
            if(snapshot!=null&&snapshot.Game!=GameKind.Wilds)throw new FormatException();
            if(!Symptoms.Contains(symptom))throw new FormatException();
            if(selected==null||selected.Count<1||selected.Count>8||selected.Select(x=>x.ActionId).Distinct().Count()!=selected.Count||selected.Any(x=>!AllowedActions.Contains(x.ActionId)||!Enum.IsDefined(typeof(ActionOutcome),x.Outcome)||x.Outcome==ActionOutcome.Unrecorded||!ActionJournal.Consistent(x.State,x.Outcome)))throw new FormatException();
            if(!ValidVersion(Rules.Version)||!ValidVersion(RuleVersion))throw new FormatException();
            var b=new StringBuilder("{\n  \"schema_version\": 1,\n  \"game_id\": \"monster-hunter-wilds\",\n  \"symptom\": \""+symptom+"\",\n  \"source\": \"native-windows\",\n  \"tool_version\": \""+Rules.Version+"\",\n  \"rule_version\": \""+RuleVersion+"\"");
            if(includeEnvironment&&snapshot!=null)
            {
                string family="unknown";var parts=(snapshot.Hardware.OsVersion??"").Split('.');int major,minor,build;
                if(parts.Length==3&&int.TryParse(parts[0],out major)&&int.TryParse(parts[1],out minor)&&int.TryParse(parts[2],out build)&&major==10&&minor==0)family=build>=22000?"windows-11":"windows-10";
                b.Append(",\n  \"os_family\": \""+family+"\"");
                var vendors=snapshot.Hardware.Gpus.Select(x=>Rules.VendorCode(x.Vendor)).Distinct().ToArray();string vendor=vendors.Length==1?(vendors[0]=="NVIDIA"?"nvidia":vendors[0]=="AMD"?"amd":vendors[0]=="Intel"?"intel":"other"):"unknown";
                b.Append(",\n  \"gpu_vendor\": \""+vendor+"\"");
                var versions=snapshot.Hardware.Gpus.Select(x=>x.DriverVersion).Distinct().ToArray();
                if(versions.Length==1&&ValidVersion(versions[0])&&Rules.NumericVersionValue(versions[0])!=null)b.Append(",\n  \"driver_version\": \""+versions[0]+"\"");
            }
            b.Append(",\n  \"actions\": [\n");
            for(int i=0;i<selected.Count;i++)
            {
                var r=selected[i];b.Append("    {\"action_id\":\""+r.ActionId+"\",\"outcome\":\""+Outcome(r.Outcome)+"\",\"evidence\":\"self-report\"}");
                b.Append(i+1<selected.Count?",\n":"\n");
            }
            b.Append("  ]\n}\n");string result=b.ToString();if(Encoding.UTF8.GetByteCount(result)>MaxBytes)throw new FormatException();return result;
        }
    }
}
