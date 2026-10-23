using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;

namespace Gemnao.Diagnostics
{
    public enum ActionOutcome { Unrecorded, Resolved, Improved, Unchanged, Worse, NotTried, Unknown }
    public enum ObservedChange { NotCompared, Changed, Same, Unknown }
    public sealed class ActionRecord
    {
        public int Sequence;
        public string ActionId;
        public StepState State;
        public ActionOutcome Outcome;
        public SteamObservation SteamBefore,SteamAfter;
        public ObservedChange DriverChange,AdminChange;
        public bool SameSessionComparison;
    }
    public sealed class ActionJournal
    {
        public const int MaxRecords=64,MaxBytes=32768;
        public readonly List<ActionRecord> Records=new List<ActionRecord>();
        public bool Restored;
        public GameKind Game { get; private set; }
        public GameSymptom Symptom { get; private set; }
        private string salt, binding;
        public bool Bound { get { return salt!=null&&binding!=null; } }
        private static bool Hex(string value){return value!=null&&Regex.IsMatch(value,@"\A[0-9A-F]{64}\z");}
        private static string Digest(string path,string key)
        {
            if(!Rules.IsLocalExe(path)||!Hex(key))throw new FormatException();
            string normalized=SteamText.NormalizeLocalPath(path);if(normalized==null)throw new FormatException();
            byte[] bytes=Enumerable.Range(0,32).Select(i=>Convert.ToByte(key.Substring(i*2,2),16)).ToArray();
            using(var h=new HMACSHA256(bytes))return BitConverter.ToString(h.ComputeHash(Encoding.UTF8.GetBytes(normalized.ToUpperInvariant()))).Replace("-","");
        }
        public void Bind(string path,GameKind game,GameSymptom symptom)
        {
            if(Bound||!GameProfile.Accepts(path,game)||!Enum.IsDefined(typeof(GameSymptom),symptom)||Records.Any(x=>!GameProfile.Catalog(game,symptom).Any(s=>s.Id==x.ActionId)))throw new FormatException();
            var bytes=new byte[32];using(var random=RandomNumberGenerator.Create())random.GetBytes(bytes);
            salt=BitConverter.ToString(bytes).Replace("-","");binding=Digest(path,salt);Game=game;Symptom=symptom;
        }
        public bool Matches(string path,GameKind game,GameSymptom symptom)
        {
            if(!Bound||Game!=game||Symptom!=symptom||!GameProfile.Accepts(path,game))return false;
            try{return binding==Digest(path,salt);}catch{return false;}
        }
        public ActionRecord Latest(string id) { return Records.LastOrDefault(x=>x.ActionId==id); }
        public void Record(string id,StepState state,ActionOutcome outcome,Snapshot before=null,Snapshot after=null)
        {
            if((Bound&&!GameProfile.Catalog(Game,Symptom).Any(x=>x.Id==id))||!KnownAction(id)||!ValidEnum(state)||!ValidEnum(outcome)||!Consistent(state,outcome))throw new FormatException();
            var r=new ActionRecord{ActionId=id,State=state,Outcome=outcome};
            bool comparable=before!=null&&after!=null&&before.TargetSession!=Guid.Empty&&before.TargetSession==after.TargetSession&&before.Game==after.Game&&before.Symptom==after.Symptom&&before.AttemptId!=after.AttemptId&&before.EndUtc<after.StartUtc;
            if(comparable)
            {
                r.SameSessionComparison=true;r.SteamBefore=SteamEvidence.Observation(before.Steam);r.SteamAfter=SteamEvidence.Observation(after.Steam);
                r.AdminChange=before.Wilds.CompatibilityStatus==ReadStatus.Complete&&after.Wilds.CompatibilityStatus==ReadStatus.Complete?(before.Wilds.GameAdminFlag==after.Wilds.GameAdminFlag?ObservedChange.Same:ObservedChange.Changed):ObservedChange.Unknown;
                r.DriverChange=before.Hardware.GpuStatus==ReadStatus.Complete&&after.Hardware.GpuStatus==ReadStatus.Complete&&before.Hardware.Gpus.Count==after.Hardware.Gpus.Count&&before.Hardware.Gpus.Count>0&&before.Hardware.Gpus.All(x=>Rules.NumericVersionValue(x.DriverVersion)!=null)&&after.Hardware.Gpus.All(x=>Rules.NumericVersionValue(x.DriverVersion)!=null)?(string.Join(";",before.Hardware.Gpus.Select(x=>x.Vendor+":"+x.DriverVersion).OrderBy(x=>x))==string.Join(";",after.Hardware.Gpus.Select(x=>x.Vendor+":"+x.DriverVersion).OrderBy(x=>x))?ObservedChange.Same:ObservedChange.Changed):ObservedChange.Unknown;
            }
            Records.Add(r);if(Records.Count>MaxRecords)Records.RemoveAt(0);
            for(int i=0;i<Records.Count;i++)Records[i].Sequence=i+1;
        }
        public static bool Consistent(StepState state,ActionOutcome result){return result==ActionOutcome.Unrecorded||result==ActionOutcome.Unknown||(result==ActionOutcome.NotTried?state!=StepState.Tried:state==StepState.Tried);}
        public static bool KnownAction(string id) { return GameProfile.AllSteps.Any(x=>x.Id==id); }
        private static bool ValidEnum<T>(T value) { return Enum.IsDefined(typeof(T),value); }
        public static string OutcomeText(ActionOutcome result)
        {
            switch(result){case ActionOutcome.Resolved:return L.T("ActionHistory.002");case ActionOutcome.Improved:return L.T("ActionHistory.003");case ActionOutcome.Unchanged:return L.T("ActionHistory.004");case ActionOutcome.Worse:return L.T("ActionHistory.005");case ActionOutcome.NotTried:return L.T("ActionHistory.006");case ActionOutcome.Unknown:return L.T("ActionHistory.007");default:return L.T("ActionHistory.008");}
        }
        public static ActionOutcome FromTrial(TrialOutcome trial)
        {
            return trial==TrialOutcome.Better?ActionOutcome.Improved:trial==TrialOutcome.Same?ActionOutcome.Unchanged:trial==TrialOutcome.Worse?ActionOutcome.Worse:trial==TrialOutcome.Unsure?ActionOutcome.Unknown:ActionOutcome.Unrecorded;
        }
        private static string ChangeText(ObservedChange c){return c==ObservedChange.Changed?L.T("ActionHistory.009"):c==ObservedChange.Same?L.T("ActionHistory.010"):c==ObservedChange.Unknown?L.T("ActionHistory.011"):L.T("ActionHistory.012");}
        public string Summary()
        {
            var b=new StringBuilder(L.T("ActionHistory.013"));
            if(Bound)b.AppendLine(L.T("ActionHistory.014")+GameProfile.Name(Game)+" / "+GameProfile.SymptomText(Symptom)+L.T("ActionHistory.015"));
            b.AppendLine(Restored?L.T("ActionHistory.016"):L.T("ActionHistory.017"));
            if(Records.Count==0)b.AppendLine(L.T("ActionHistory.018"));
            foreach(var r in Records)
            {
                var step=GameProfile.AllSteps.FirstOrDefault(x=>x.Id==r.ActionId);if(step==null)continue;
                b.AppendLine(r.Sequence.ToString(CultureInfo.InvariantCulture)+". "+step.Title+" / "+Rules.StateText(r.State)+" / "+OutcomeText(r.Outcome));
                if(r.SameSessionComparison)b.AppendLine(L.T("ActionHistory.019")+SteamEvidence.ObservationText(r.SteamBefore)+" → "+SteamEvidence.ObservationText(r.SteamAfter)+L.T("ActionHistory.020")+ChangeText(r.DriverChange)+L.T("ActionHistory.021")+ChangeText(r.AdminChange));
            }
            b.AppendLine(L.T("ActionHistory.022"));return b.ToString();
        }
        public byte[] Encode()
        {
            if(!Bound||!Hex(salt)||!Hex(binding))throw new FormatException();
            var root=new XElement("gemnao-history",new XAttribute("schema","2"),new XAttribute("game",Game==GameKind.Wilds?WildsProfile.AppId:"general"),new XAttribute("symptom",(int)Symptom),new XAttribute("salt",salt),new XAttribute("binding",binding));
            foreach(var r in Records)
            {
                if(!GameProfile.Catalog(Game,Symptom).Any(x=>x.Id==r.ActionId)||!KnownAction(r.ActionId)||!Consistent(r.State,r.Outcome)||!ValidEnum(r.State)||!ValidEnum(r.Outcome)||!ValidEnum(r.SteamBefore)||!ValidEnum(r.SteamAfter)||!ValidEnum(r.DriverChange)||!ValidEnum(r.AdminChange))throw new FormatException();
                root.Add(new XElement("record",new XAttribute("n",r.Sequence),new XAttribute("action",r.ActionId),new XAttribute("state",(int)r.State),new XAttribute("outcome",(int)r.Outcome),new XAttribute("steam-before",(int)r.SteamBefore),new XAttribute("steam-after",(int)r.SteamAfter),new XAttribute("driver",(int)r.DriverChange),new XAttribute("admin",(int)r.AdminChange),new XAttribute("compared",r.SameSessionComparison?"1":"0")));
            }
            var data=new UTF8Encoding(false,true).GetBytes(root.ToString(SaveOptions.DisableFormatting));
            if(data.Length>MaxBytes||Records.Count>MaxRecords)throw new FormatException();return data;
        }
        private static T EnumValue<T>(XElement e,string name)
        {
            int n;string text=(string)e.Attribute(name);if(text==null||text.Length!=1||!int.TryParse(text,NumberStyles.None,CultureInfo.InvariantCulture,out n)||!Enum.IsDefined(typeof(T),n))throw new FormatException();return (T)Enum.ToObject(typeof(T),n);
        }
        public static ActionJournal Decode(byte[] bytes)
        {
            if(bytes==null||bytes.Length>MaxBytes)throw new FormatException();
            var settings=new XmlReaderSettings{DtdProcessing=DtdProcessing.Prohibit,XmlResolver=null,MaxCharactersInDocument=MaxBytes};
            XDocument doc;
            try{using(var input=new StringReader(new UTF8Encoding(false,true).GetString(bytes)))using(var reader=XmlReader.Create(input,settings))doc=XDocument.Load(reader);}
            catch{throw new FormatException();}
            var root=doc.Root;if(doc.Nodes().Any(n=>!(n is XElement)))throw new FormatException();if(root==null||root.Name!="gemnao-history"||root.Attributes().Count()!=5||(string)root.Attribute("schema")!="2"||!new[]{WildsProfile.AppId,"general"}.Contains((string)root.Attribute("game"))||!Hex((string)root.Attribute("salt"))||!Hex((string)root.Attribute("binding"))||root.Nodes().Any(n=>!(n is XElement)))throw new FormatException();
            var result=new ActionJournal{Restored=true,Game=(string)root.Attribute("game")==WildsProfile.AppId?GameKind.Wilds:GameKind.General,Symptom=EnumValue<GameSymptom>(root,"symptom"),salt=(string)root.Attribute("salt"),binding=(string)root.Attribute("binding")};int sequence=0;
            foreach(var e in root.Elements())
            {
                if(++sequence>MaxRecords||e.Name!="record"||e.Nodes().Any()||e.Value!=""||e.Attributes().Count()!=9)throw new FormatException();
                var expected=new[]{"n","action","state","outcome","steam-before","steam-after","driver","admin","compared"};if(e.Attributes().Any(a=>!expected.Contains(a.Name.ToString())))throw new FormatException();
                if((string)e.Attribute("n")!=sequence.ToString(CultureInfo.InvariantCulture)||!KnownAction((string)e.Attribute("action")))throw new FormatException();
                string compared=(string)e.Attribute("compared");if(compared!="0"&&compared!="1")throw new FormatException();
                var r=new ActionRecord{Sequence=sequence,ActionId=(string)e.Attribute("action"),State=EnumValue<StepState>(e,"state"),Outcome=EnumValue<ActionOutcome>(e,"outcome"),SteamBefore=EnumValue<SteamObservation>(e,"steam-before"),SteamAfter=EnumValue<SteamObservation>(e,"steam-after"),DriverChange=EnumValue<ObservedChange>(e,"driver"),AdminChange=EnumValue<ObservedChange>(e,"admin"),SameSessionComparison=compared=="1"};
                if(!GameProfile.Catalog(result.Game,result.Symptom).Any(x=>x.Id==r.ActionId)||!Consistent(r.State,r.Outcome))throw new FormatException();
                if(!r.SameSessionComparison&&(r.SteamBefore!=SteamObservation.Unknown||r.SteamAfter!=SteamObservation.Unknown||r.DriverChange!=ObservedChange.NotCompared||r.AdminChange!=ObservedChange.NotCompared))throw new FormatException();
                result.Records.Add(r);
            }
            return result;
        }
    }
}
