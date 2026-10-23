using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Gemnao.Diagnostics
{
    internal sealed partial class MainForm : Form
    {
        private string targetPath, steamExe;
        private GameKind selectedGame;
        private GameSymptom selectedSymptom;
        private GameStore selectedStore;
        private readonly ComboBox profile=Combo(L.T("MainForm.001"),L.T("MainForm.002"));
        private readonly ComboBox symptom=Combo(GameProfile.SymptomLabels);
        private readonly ComboBox store=Combo(L.T("MainForm.003"),"Steam",L.T("MainForm.004"));
        private readonly ComboBox scene=Combo(GameProfile.SceneLabels);
        private readonly ComboBox frequency=Combo(GameProfile.FrequencyLabels);
        private readonly ComboBox lowerGraphics=Combo(GameProfile.GraphicsTrialLabels);
        private string pendingRetestActionId;
        private Guid targetSession;
        private Snapshot current, baseline;
        private DateTime? measureStart;
        private bool busy, updating, measurementIsRetest, sessionRestartObserved;
        private CancellationTokenSource cancellation;
        private List<ActionPlanItem> plan = new List<ActionPlanItem>();
        private readonly Dictionary<string, StepState> states = new Dictionary<string, StepState>();
        private readonly TabControl tabs = new TabControl { Dock=DockStyle.Fill };
        private readonly CheckBox traceConsent = new CheckBox { Text=L.T("MainForm.005"),AutoSize=true,MaximumSize=new Size(940,0) };
        private readonly CheckBox archiveConsent = new CheckBox { Text=L.T("MainForm.006"),AutoSize=true,MaximumSize=new Size(940,0) };
        private readonly CheckBox steamConsent = new CheckBox { Text=L.T("MainForm.007"),AutoSize=true,MaximumSize=new Size(940,0) };
        private readonly Button chooseSteam = Button(L.T("MainForm.008"));
        private readonly Button reread = Button(CaptureWorkflow.RefreshButtonText);
        private readonly Button rereadFromActions = Button(CaptureWorkflow.RefreshButtonText);
        private readonly Button pickArchive = Button(L.T("MainForm.009"));
        private readonly CheckBox consent = new CheckBox { Text=L.T("MainForm.010"), AutoSize=true };
        private readonly Button find = Button(L.T("MainForm.011"));
        private readonly Button choose = Button(L.T("MainForm.012"));
        private readonly Button reset = Button(L.T("MainForm.013"));
        private readonly Label targetLabel = Label(L.T("MainForm.014"));
        private readonly ComboBox stage = Combo(WildsProfile.StageText(LaunchStage.ImmediateExit),WildsProfile.StageText(LaunchStage.CrashReporter),WildsProfile.StageText(LaunchStage.ShaderPreparation),WildsProfile.StageText(LaunchStage.GraphicsError),WildsProfile.StageText(LaunchStage.SecurityNotice),WildsProfile.StageText(LaunchStage.Other),WildsProfile.StageText(LaunchStage.UnhandledException));
        private readonly ComboBox worked = Combo(L.T("MainForm.015"),L.T("MainForm.016"),L.T("MainForm.017"));
        private readonly ComboBox demo = Combo(L.T("MainForm.015"),L.T("MainForm.018"),L.T("MainForm.019"));
        private readonly ComboBox capture = Combo(L.T("MainForm.015"),L.T("MainForm.020"),L.T("MainForm.021"));
        private readonly ComboBox mods = Combo(L.T("MainForm.015"),L.T("MainForm.022"),L.T("MainForm.023"));
        private readonly ComboBox textures = Combo(L.T("MainForm.015"),L.T("MainForm.024"),L.T("MainForm.025"));
        private readonly ComboBox pcIssue = Combo(L.T("MainForm.015"),L.T("MainForm.026"),L.T("MainForm.027"));
        private readonly ComboBox verify = Combo(L.T("MainForm.028"),L.T("MainForm.029"),L.T("MainForm.030"),L.T("MainForm.031"));
        private readonly Button begin = Button(L.T("MainForm.032"));
        private readonly Button recent = Button(L.T("MainForm.033"));
        private readonly Button finish = Button(CaptureWorkflow.FinishButtonText);
        private readonly Button cancel = Button(L.T("MainForm.034"));
        private readonly Label progress = Label(L.T("MainForm.035"));
        private readonly Label measureLabel = Label(L.T("MainForm.036"));
        private readonly Label elapsed = Label("");
        private readonly Label resultSummary = Label(L.T("MainForm.037"));
        private readonly ListBox actions = new ListBox { Dock=DockStyle.Fill, IntegralHeight=false, HorizontalScrollbar=true };
        private readonly TextBox actionDetail = ReadBox();
        private readonly ComboBox actionState = Combo(L.T("MainForm.028"),L.T("MainForm.038"),L.T("MainForm.039"),L.T("MainForm.040"));
        private readonly ComboBox outcome = Combo(L.T("MainForm.041"),L.T("MainForm.042"),L.T("MainForm.043"),L.T("MainForm.044"),L.T("MainForm.045"));
        private readonly Button guide = Button(L.T("MainForm.046"));
        private readonly Button official = Button(L.T("MainForm.047"));
        private readonly Button retest = Button(L.T("MainForm.048"));
        private readonly TextBox report = ReadBox();
        private readonly Button export = Button(L.T("MainForm.049"));
        private readonly System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer { Interval=1000 };

        internal MainForm()
        {
            Text=L.T("MainForm.050") + Rules.Version;
            Width=1100; Height=850; MinimumSize=new Size(800,650); StartPosition=FormStartPosition.CenterScreen;
            Font=new Font("Yu Gothic UI",10); AutoScaleMode=AutoScaleMode.Dpi;
            var root=new TableLayoutPanel { Dock=DockStyle.Fill,ColumnCount=1,RowCount=3,Padding=new Padding(14) };
            root.RowStyles.Add(new RowStyle(SizeType.AutoSize)); root.RowStyles.Add(new RowStyle(SizeType.Percent,100)); root.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            var header=Flow(); header.Controls.Add(new Label { Text=L.T("MainForm.051"),Font=new Font(Font.FontFamily,18,FontStyle.Bold),AutoSize=true });
            BuildLanguageSelector(header); header.Controls.Add(progress); root.Controls.Add(header,0,0); root.Controls.Add(tabs,0,1);
            root.Controls.Add(Label(L.T("MainForm.052")),0,2); Controls.Add(root);
            BuildSetup(); BuildMeasurement(); BuildActions(); BuildReportTab(); BuildHistoryTab();
            profile.SelectedIndexChanged+=(s,e)=>ChangeScope(); symptom.SelectedIndexChanged+=(s,e)=>ChangeScope(); store.SelectedIndexChanged+=(s,e)=>ChangeStore();
            consent.CheckedChanged+=(s,e)=>UpdateButtons();
            steamConsent.CheckedChanged+=(s,e)=>UpdateButtons(); chooseSteam.Click+=(s,e)=>ChooseSteamTarget();
            traceConsent.CheckedChanged+=(s,e)=>UpdateButtons(); archiveConsent.CheckedChanged+=(s,e)=>UpdateButtons();
            reread.Click+=async(s,e)=>await RefreshCapture(); rereadFromActions.Click+=async(s,e)=>await RefreshCapture(); pickArchive.Click+=async(s,e)=>await PickArchive();
            choose.Click+=(s,e)=>ChooseTarget(); find.Click+=async(s,e)=>await FindTarget(); reset.Click+=(s,e)=>ResetSession();
            begin.Click+=(s,e)=>BeginMeasurement(false); retest.Click+=(s,e)=>BeginMeasurement(true);
            recent.Click+=async(s,e)=>await ReadRecent(); finish.Click+=async(s,e)=>await FinishMeasurement();
            cancel.Click+=(s,e)=>CancelWork();
            foreach(var combo in new[]{stage,worked,demo,capture,mods,textures,pcIssue,verify,scene,frequency,lowerGraphics})combo.SelectedIndexChanged+=(s,e)=> { if(updating)return; RefreshResults(); UpdateButtons(); };
            actions.SelectedIndexChanged+=(s,e)=>ShowAction();
            actionState.SelectedIndexChanged+=(s,e)=> { if(updating || actions.SelectedIndex<0 || actions.SelectedIndex>=plan.Count)return; string id=plan[actions.SelectedIndex].Step.Id; StepState state=(StepState)actionState.SelectedIndex; states[id]=state; journal.Record(id,state,ActionOutcome.Unrecorded); RefreshResults(); RefreshJournal(); };
            outcome.SelectedIndexChanged+=(s,e)=> { if(updating)return; if(retestActionId!=null&&baseline!=null&&current!=null){journal.Record(retestActionId,StepState.Tried,ActionJournal.FromTrial((TrialOutcome)outcome.SelectedIndex),baseline,current);states[retestActionId]=StepState.Tried;RefreshJournal();} RefreshResults(outcome.SelectedIndex==2 || outcome.SelectedIndex==3); };
            guide.Click+=(s,e)=>OpenLink(false); official.Click+=(s,e)=>OpenLink(true); export.Click+=(s,e)=>ShowExport();
            timer.Tick+=(s,e)=> { if(measureStart.HasValue) { var span=DateTime.UtcNow-measureStart.Value; elapsed.Text=L.T("MainForm.053")+span.ToString(@"hh\:mm\:ss"); if(span.TotalHours>=24) { measureStart=null; timer.Stop(); progress.Text=L.T("MainForm.054"); UpdateButtons(); } } };
            FormClosing+=(s,e)=> { cancellation?.Cancel(); timer.Stop(); };
            FormClosed+=(s,e)=> { timer.Dispose(); cancellation?.Dispose(); };
            UpdateButtons();
        }
        private void BuildSetup()
        {
            var page=new TabPage(L.T("MainForm.055")); var f=Flow(); f.Dock=DockStyle.Fill; f.AutoScroll=true;
            f.Controls.Add(Label(L.T("MainForm.056")));
            f.Controls.Add(Label(L.T("MainForm.057")));
            f.Controls.Add(Row(Label(L.T("MainForm.058")),profile)); f.Controls.Add(Row(Label(L.T("MainForm.059")),symptom)); f.Controls.Add(Row(Label(L.T("MainForm.060")),store));
            f.Controls.Add(consent); f.Controls.Add(traceConsent); f.Controls.Add(archiveConsent); f.Controls.Add(steamConsent); f.Controls.Add(Label(L.T("MainForm.061"))); f.Controls.Add(Row(find,choose,reset)); f.Controls.Add(chooseSteam); f.Controls.Add(targetLabel);
            f.Controls.Add(Label(L.T("MainForm.062")));
            f.Controls.Add(Row(Label(L.T("MainForm.063")),scene)); f.Controls.Add(Row(Label(L.T("MainForm.064")),frequency)); f.Controls.Add(Row(Label(L.T("MainForm.065")),lowerGraphics));
            f.Controls.Add(Row(Label(L.T("MainForm.066")),stage)); f.Controls.Add(Row(Label(L.T("MainForm.067")),worked));
            f.Controls.Add(Row(Label(L.T("MainForm.068")),demo)); f.Controls.Add(Row(Label(L.T("MainForm.069")),capture));
            f.Controls.Add(Row(Label(L.T("MainForm.070")),mods)); f.Controls.Add(Row(Label(L.T("MainForm.071")),textures));
            f.Controls.Add(Row(Label(L.T("MainForm.072")),pcIssue)); f.Controls.Add(Row(Label(L.T("MainForm.073")),verify));
            f.Controls.Add(Label(L.T("MainForm.074")));
            f.Controls.Add(Row(begin,recent)); FitFlow(f,page); page.Controls.Add(f); tabs.TabPages.Add(page);
        }
        private void BuildMeasurement()
        {
            var page=new TabPage(L.T("MainForm.075")); var f=Flow(); f.Dock=DockStyle.Fill; f.AutoScroll=true;
            f.Controls.Add(new Label { Text=L.T("MainForm.076"),AutoSize=true,Font=new Font(Font.FontFamily,16,FontStyle.Bold) });
            f.Controls.Add(measureLabel); f.Controls.Add(elapsed);
            f.Controls.Add(Label(L.T("MainForm.077")));
            f.Controls.Add(Label(L.T("MainForm.078")));
            f.Controls.Add(Row(finish,cancel));
            f.Controls.Add(Label(L.T("MainForm.079")));
            FitFlow(f,page); page.Controls.Add(f); tabs.TabPages.Add(page);
        }
        private void BuildActions()
        {
            var page=new TabPage(L.T("MainForm.080"));
            var grid=new TableLayoutPanel { Dock=DockStyle.Fill,ColumnCount=1,RowCount=6,Padding=new Padding(8) };
            grid.RowStyles.Add(new RowStyle(SizeType.AutoSize)); grid.RowStyles.Add(new RowStyle(SizeType.AutoSize)); grid.RowStyles.Add(new RowStyle(SizeType.Absolute,145)); grid.RowStyles.Add(new RowStyle(SizeType.Percent,100)); grid.RowStyles.Add(new RowStyle(SizeType.AutoSize)); grid.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            grid.Controls.Add(resultSummary,0,0); grid.Controls.Add(Row(rereadFromActions),0,1); grid.Controls.Add(actions,0,2); grid.Controls.Add(actionDetail,0,3); grid.Controls.Add(Row(actionState,guide,official),0,4); grid.Controls.Add(Row(retest,outcome),0,5);
            page.Controls.Add(grid); tabs.TabPages.Add(page);
        }
        private void BuildReportTab()
        {
            var page=new TabPage(L.T("MainForm.081")); var grid=new TableLayoutPanel { Dock=DockStyle.Fill,ColumnCount=1,RowCount=3,Padding=new Padding(8) };
            grid.RowStyles.Add(new RowStyle(SizeType.AutoSize)); grid.RowStyles.Add(new RowStyle(SizeType.Percent,100)); grid.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            grid.Controls.Add(Label(L.T("MainForm.082")),0,0); grid.Controls.Add(report,0,1); grid.Controls.Add(Row(export,reread,pickArchive),0,2); page.Controls.Add(grid); tabs.TabPages.Add(page);
        }
        private static Button Button(string t) { return new Button { Text=t,AutoSize=true,Padding=new Padding(8,4,8,4),Margin=new Padding(3,5,3,5) }; }
        private static Label Label(string t) { return new Label { Text=t,AutoSize=true,MaximumSize=new Size(950,0),Margin=new Padding(3,7,3,7) }; }
        private static ComboBox Combo(params string[] items) { var c=new ComboBox { DropDownStyle=ComboBoxStyle.DropDownList,Width=330 }; c.Items.AddRange(items); c.SelectedIndex=0; c.DropDownWidth=700; return c; }
        private static TextBox ReadBox() { return new TextBox { Multiline=true,ReadOnly=true,ScrollBars=ScrollBars.Both,WordWrap=true,Dock=DockStyle.Fill,BackColor=Color.White }; }
        private static FlowLayoutPanel Flow() { return new FlowLayoutPanel { FlowDirection=FlowDirection.TopDown,WrapContents=false,AutoSize=true,Padding=new Padding(8) }; }
        private static FlowLayoutPanel Row(params Control[] controls) { var f=new FlowLayoutPanel { AutoSize=true,WrapContents=true,MaximumSize=new Size(970,0) }; f.Controls.AddRange(controls); return f; }
        private WildsAnswers Answers() { return new WildsAnswers { Stage=(LaunchStage)stage.SelectedIndex,WorkedBefore=(Answer)worked.SelectedIndex,DemoWorked=(Answer)demo.SelectedIndex,CaptureTools=(Answer)capture.SelectedIndex,Mods=(Answer)mods.SelectedIndex,TexturePack=(Answer)textures.SelectedIndex,WholePcIssue=(Answer)pcIssue.SelectedIndex,Verification=(VerifyResult)verify.SelectedIndex }; }
        private GameAnswers GeneralAnswers(){return new GameAnswers{Symptom=selectedSymptom,Store=(GameStore)store.SelectedIndex,Scene=(GameScene)scene.SelectedIndex,Frequency=(Frequency)frequency.SelectedIndex,LowerGraphics=(GraphicsTrial)lowerGraphics.SelectedIndex,Shared=Answers()};}
        private void BindJournal(){if(targetPath!=null&&!journal.Bound)journal.Bind(targetPath,selectedGame,selectedSymptom);}
        private void ClearGameAnswers()
        {
            foreach(var c in new[]{stage,worked,demo,capture,mods,textures,verify,scene,frequency,lowerGraphics})c.SelectedIndex=0;
        }
        private void ChangeStore()
        {
            if(updating)return;
            var next=(GameStore)store.SelectedIndex;
            if(selectedGame==GameKind.Wilds&&next!=GameStore.Steam){updating=true;store.SelectedIndex=(int)selectedStore;updating=false;MessageBox.Show(this,L.T("MainForm.083"));return;}
            if(current!=null&&MessageBox.Show(this,L.T("MainForm.084"),L.T("MainForm.085"),MessageBoxButtons.YesNo)!=DialogResult.Yes){updating=true;store.SelectedIndex=(int)selectedStore;updating=false;return;}
            selectedStore=next;updating=true;steamConsent.Checked=false;steamExe=null;updating=false;
            current=baseline=null;targetSession=Guid.NewGuid();retestActionId=pendingRetestActionId=null;plan.Clear();actions.Items.Clear();actionDetail.Clear();report.Clear();resultSummary.Text=L.T("MainForm.086");UpdateButtons();
        }
        private void ChangeScope()
        {
            if(updating)return;
            var nextGame=(GameKind)profile.SelectedIndex;var nextSymptom=(GameSymptom)symptom.SelectedIndex;
            if(nextGame==selectedGame&&nextSymptom==selectedSymptom)return;
            if((current!=null||journal.Records.Count>0)&&MessageBox.Show(this,L.T("MainForm.087"),L.T("MainForm.088"),MessageBoxButtons.YesNo)!=DialogResult.Yes)
            {updating=true;profile.SelectedIndex=(int)selectedGame;symptom.SelectedIndex=(int)selectedSymptom;updating=false;return;}
            selectedGame=nextGame;selectedSymptom=nextSymptom;
            if(targetPath!=null&&!GameProfile.Accepts(targetPath,selectedGame)){targetPath=null;steamExe=null;targetLabel.Text=L.T("MainForm.089");}
            updating=true;ClearGameAnswers();if(selectedGame==GameKind.Wilds){store.SelectedIndex=(int)GameStore.Steam;selectedStore=GameStore.Steam;}updating=false;
            current=baseline=null;targetSession=Guid.NewGuid();journal=new ActionJournal();BindJournal();states.Clear();plan.Clear();actions.Items.Clear();actionDetail.Clear();report.Clear();retestActionId=pendingRetestActionId=null;
            updating=true;outcome.SelectedIndex=0;traceConsent.Checked=archiveConsent.Checked=false;updating=false;
            ResetHistoryCatalog();RefreshJournal();progress.Text=L.T("MainForm.090");resultSummary.Text=L.T("MainForm.091");UpdateButtons();
        }
        private void SelectTarget(string path,string steam)
        {
            if(!GameProfile.Accepts(path,selectedGame) || !LocalGuard.Allowed(path)) { MessageBox.Show(this,L.T("MainForm.092")); return; }
            if(string.Equals(path,targetPath,StringComparison.OrdinalIgnoreCase))
            {
                if(!string.IsNullOrEmpty(steam))
                {
                    string next=Path.GetFullPath(steam);
                    if(!string.Equals(next,steamExe,StringComparison.OrdinalIgnoreCase))
                    {
                        if(current!=null&&MessageBox.Show(this,L.T("MainForm.093"),L.T("MainForm.094"),MessageBoxButtons.YesNo)!=DialogResult.Yes)return;
                        steamExe=next;current=baseline=null;targetSession=Guid.NewGuid();retestActionId=pendingRetestActionId=null;report.Clear();plan.Clear();actions.Items.Clear();actionDetail.Clear();resultSummary.Text=L.T("MainForm.095");
                    }
                    progress.Text=L.T("MainForm.096");UpdateButtons();
                }
                return;
            }
            if(targetPath!=null&&journal.Records.Count>0&&MessageBox.Show(this,L.T("MainForm.097"),L.T("MainForm.098"),MessageBoxButtons.YesNo)!=DialogResult.Yes)return;
            updating=true;
            if(targetPath!=null){ClearGameAnswers();steamConsent.Checked=false;store.SelectedIndex=(int)(selectedGame==GameKind.Wilds?GameStore.Steam:GameStore.Unknown);selectedStore=(GameStore)store.SelectedIndex;}
            journal=new ActionJournal(); retestActionId=pendingRetestActionId=null;updating=false;
            targetPath=Path.GetFullPath(path); steamExe=steam==null?null:Path.GetFullPath(steam); targetSession=Guid.NewGuid(); current=baseline=null; states.Clear(); plan.Clear(); actions.Items.Clear(); outcome.SelectedIndex=0;
            BindJournal();
            targetLabel.Text=L.T("MainForm.099")+Rules.LocalLabel(path);
            progress.Text=L.T("MainForm.100"); report.Clear(); actionDetail.Clear(); resultSummary.Text=L.T("MainForm.091"); RefreshJournal(); UpdateButtons();
        }
        private void ChooseTarget()
        {
            if(!consent.Checked || busy || measureStart.HasValue)return;
            using(var d=new OpenFileDialog { Title=L.T("MainForm.101"),Filter=L.T("MainForm.102"),FileName="",CheckFileExists=true,Multiselect=false,RestoreDirectory=true }) if(d.ShowDialog(this)==DialogResult.OK)SelectTarget(d.FileName,null);
        }
        private void ChooseSteamTarget()
        {
            if(!consent.Checked||!steamConsent.Checked||busy||measureStart.HasValue)return;
            using(var dialog=new OpenFileDialog{Title=L.T("MainForm.103"),Filter=L.T("MainForm.104"),FileName="steam.exe",CheckFileExists=true,Multiselect=false,RestoreDirectory=true})
            {
                if(dialog.ShowDialog(this)!=DialogResult.OK)return;
                if(!LocalGuard.Allowed(dialog.FileName)||!string.Equals(Rules.FileName(dialog.FileName),"steam.exe",StringComparison.OrdinalIgnoreCase)){MessageBox.Show(this,L.T("MainForm.105"));return;}
                string next=Path.GetFullPath(dialog.FileName);if(string.Equals(next,steamExe,StringComparison.OrdinalIgnoreCase))return;
                if(current!=null&&MessageBox.Show(this,L.T("MainForm.106"),L.T("MainForm.107"),MessageBoxButtons.YesNo)!=DialogResult.Yes)return;
                steamExe=next;current=baseline=null;targetSession=Guid.NewGuid();retestActionId=pendingRetestActionId=null;report.Clear();plan.Clear();actions.Items.Clear();actionDetail.Clear();resultSummary.Text=L.T("MainForm.108");progress.Text=L.T("MainForm.109");UpdateButtons();
            }
        }
        private async Task FindTarget()
        {
            if(!consent.Checked || selectedGame!=GameKind.Wilds || busy || measureStart.HasValue)return;
            busy=true; cancellation?.Dispose(); cancellation=new CancellationTokenSource(); UpdateButtons(); progress.Text=L.T("MainForm.110");
            try
            {
                var token=cancellation.Token;
                var found=await Task.Run(()=>SteamDiscovery.Find(token)); if(IsDisposed)return; token.ThrowIfCancellationRequested();
                if(found.Entries.Count==1)SelectTarget(found.Entries[0].GamePath,found.Entries[0].SteamExe);
                else if(found.Entries.Count>1)
                {
                    using(var dlg=new Form { Text=L.T("MainForm.111"),Width=800,Height=300,StartPosition=FormStartPosition.CenterParent })
                    {
                        var list=new ListBox { Dock=DockStyle.Fill }; list.Items.AddRange(found.Entries.Select(x=>(object)x.GamePath).ToArray()); list.SelectedIndex=0;
                        var ok=Button(L.T("MainForm.112")); ok.Dock=DockStyle.Bottom; ok.Click+=(s,e)=>dlg.DialogResult=DialogResult.OK; dlg.Controls.Add(list); dlg.Controls.Add(ok);
                        if(dlg.ShowDialog(this)==DialogResult.OK) { var item=found.Entries[list.SelectedIndex]; SelectTarget(item.GamePath,item.SteamExe); }
                    }
                }
                else progress.Text=L.T("MainForm.113");
                if(found.Incomplete && targetPath!=null)progress.Text=L.T("MainForm.114");
            }
            catch(OperationCanceledException) { if(!IsDisposed)progress.Text=L.T("MainForm.115"); }
            catch { if(!IsDisposed)progress.Text=L.T("MainForm.116"); }
            finally { busy=false; if(!IsDisposed)UpdateButtons(); }
        }
        private void ResetSession()
        {
            if(busy || measureStart.HasValue)return;
            if((current!=null||journal.Records.Count>0) && MessageBox.Show(this,L.T("MainForm.117"),L.T("MainForm.118"),MessageBoxButtons.YesNo)!=DialogResult.Yes)return;
            journal=new ActionJournal();BindJournal();sessionRestartObserved=false;retestActionId=pendingRetestActionId=null;current=baseline=null; targetSession=Guid.NewGuid(); states.Clear(); plan.Clear(); actions.Items.Clear(); actionDetail.Clear(); report.Clear(); outcome.SelectedIndex=0; progress.Text=L.T("MainForm.119"); resultSummary.Text=L.T("MainForm.091"); tabs.SelectedIndex=0; RefreshJournal(); UpdateButtons();
        }
        private void BeginMeasurement(bool repeat)
        {
            if(busy || measureStart.HasValue || !consent.Checked || targetPath==null)return;
            if(sessionRestartObserved||!WildsProfile.MayRetest(current,Answers())) { MessageBox.Show(this,L.T("MainForm.120")); return; }
            repeat = repeat || current != null;
            if(MessageBox.Show(this,L.T("MainForm.121")+(repeat?L.T("MainForm.122"):"")+L.T("MainForm.123"),L.T("MainForm.124"),MessageBoxButtons.YesNo,MessageBoxIcon.Information,MessageBoxDefaultButton.Button2)!=DialogResult.Yes)return;
            measurementIsRetest=repeat;
            pendingRetestActionId=repeat&&actions.SelectedIndex>=0&&actions.SelectedIndex<plan.Count?plan[actions.SelectedIndex].Step.Id:null;
            measureStart=DateTime.UtcNow; timer.Start(); elapsed.Text=L.T("MainForm.125"); tabs.SelectedIndex=1;
            measureLabel.Text=L.T("MainForm.126");
            progress.Text=repeat?L.T("MainForm.127"):L.T("MainForm.128"); UpdateButtons();
        }
        private async Task FinishMeasurement()
        {
            if(!measureStart.HasValue || busy)return;
            DateTime start=measureStart.Value;
            if((DateTime.UtcNow-start).TotalSeconds<3) { MessageBox.Show(this,L.T("MainForm.129")); return; }
            if(MessageBox.Show(this,L.T("MainForm.130"),L.T("MainForm.131"),MessageBoxButtons.YesNo,MessageBoxIcon.Information,MessageBoxDefaultButton.Button2)!=DialogResult.Yes)return;
            timer.Stop(); measureStart=null;
            await Collect(start,DateTime.UtcNow,true,measurementIsRetest?CaptureMode.Retest:CaptureMode.InitialAttempt);
        }
        private async Task ReadRecent()
        {
            if(busy || measureStart.HasValue || !consent.Checked || targetPath==null)return;
            if(current!=null) { await RefreshCapture(); return; }
            DateTime end=DateTime.UtcNow; await Collect(end.AddMinutes(-10),end,false,CaptureMode.InitialRecent);
        }
        private async Task Collect(DateTime start,DateTime end,bool settle,CaptureMode mode)
        {
            busy=true; cancellation?.Dispose(); cancellation=new CancellationTokenSource(); UpdateButtons(); tabs.SelectedIndex=1;
            try
            {
                var token=cancellation.Token;
                if(settle) { progress.Text=L.T("MainForm.132"); await Task.Delay(5000,token); end=DateTime.UtcNow; }
                progress.Text=L.T("MainForm.133");
                bool wilds=selectedGame==GameKind.Wilds;
                bool readTraces=wilds&&traceConsent.Checked,readArchive=wilds&&archiveConsent.Checked,readSteam=store.SelectedIndex==(int)GameStore.Steam&&steamConsent.Checked;
                GameKind kind=selectedGame;GameSymptom issue=selectedSymptom;string steam=store.SelectedIndex==(int)GameStore.Steam?steamExe:null;
                var s=await Task.Run(()=>WindowsCollector.Collect(targetPath,targetSession,start,end,token,steam,readTraces,readArchive,readSteam,kind,issue));
                if(IsDisposed)return;
                if(!WildsProfile.AcceptsCapture(s,targetSession,token.IsCancellationRequested))throw new OperationCanceledException();
                s.PriorRestartObserved|=sessionRestartObserved;
                CaptureTransition committed;
                if(!CaptureWorkflow.TryCommit(s,current,baseline,targetSession,token.IsCancellationRequested,mode,(TrialOutcome)outcome.SelectedIndex,out committed))
                    throw new InvalidOperationException("Capture transition rejected.");
                baseline=committed.Baseline;
                if(!committed.PreserveStepRecords&&journal.Records.Count==0)states.Clear();
                if(mode!=CaptureMode.Refresh)retestActionId=mode==CaptureMode.Retest?pendingRetestActionId:null;
                current=committed.Current;sessionRestartObserved|=current.PriorRestartObserved||current.System.Events.Any(e=>e.Kind==EventKind.UncleanRestart); updating=true; outcome.SelectedIndex=(int)committed.Outcome; updating=false; RefreshResults(); tabs.SelectedIndex=2;
                progress.Text=mode==CaptureMode.Refresh?L.T("MainForm.134"):current.Application.Events.Count==0?L.T("MainForm.135"):L.T("MainForm.136");
            }
            catch(OperationCanceledException) { if(!IsDisposed)progress.Text=L.T("MainForm.137"); }
            catch { if(!IsDisposed)progress.Text=L.T("MainForm.138"); }
            finally { busy=false; if(!IsDisposed)UpdateButtons(); }
        }
        private async Task RefreshCapture()
        {
            if(current==null||busy||measureStart.HasValue||!consent.Checked)return;
            DateTime end=DateTime.UtcNow;
            if(!CaptureWorkflow.CanRefresh(current,end)){MessageBox.Show(this,L.T("MainForm.139"));return;}
            if(MessageBox.Show(this,L.T("MainForm.140"),L.T("MainForm.141"),MessageBoxButtons.YesNo,MessageBoxIcon.Information,MessageBoxDefaultButton.Button2)!=DialogResult.Yes)return;
            end=DateTime.UtcNow;
            if(!CaptureWorkflow.CanRefresh(current,end)){MessageBox.Show(this,L.T("MainForm.142"));return;}
            await Collect(current.StartUtc,end,false,CaptureMode.Refresh);
        }
        private async Task PickArchive()
        {
            if(current==null||current.Game!=GameKind.Wilds||selectedGame!=GameKind.Wilds||busy||!consent.Checked||!archiveConsent.Checked)return;
            using(var dialog=new OpenFileDialog{Title=L.T("MainForm.143"),Filter="ZIP (*.zip)|*.zip",CheckFileExists=true,Multiselect=false,RestoreDirectory=true})
            {
                if(dialog.ShowDialog(this)!=DialogResult.OK)return;
                busy=true;cancellation?.Dispose();cancellation=new CancellationTokenSource();var token=cancellation.Token;UpdateButtons();
                string archivePath=dialog.FileName;var moduleContext=steamConsent.Checked?SteamLocal.Context(steamExe):null;
                try{var facts=await Task.Run(()=>OptionalChecks.ReadArchive(archivePath,token,moduleContext));if(IsDisposed)return;token.ThrowIfCancellationRequested();current.Archive=facts;RefreshResults();tabs.SelectedIndex=3;}
                catch(OperationCanceledException){if(!IsDisposed)progress.Text=L.T("MainForm.144");}
                catch{if(!IsDisposed)progress.Text=L.T("MainForm.145");}
                finally{busy=false;if(!IsDisposed)UpdateButtons();}
            }
        }
        private void CancelWork()
        {
            if(measureStart.HasValue) { measureStart=null; timer.Stop(); progress.Text=L.T("MainForm.146"); UpdateButtons(); }
            else if(busy) { cancellation?.Cancel(); progress.Text=L.T("MainForm.147"); cancel.Enabled=false; }
        }
        private void RefreshResults(bool advance=false)
        {
            if(current==null)return;
            string previous=actions.SelectedIndex>=0 && actions.SelectedIndex<plan.Count?plan[actions.SelectedIndex].Step.Id:null;
            bool priorUpdating=updating;
            plan=GameProfile.Plan(current,GeneralAnswers()); updating=true; actions.Items.Clear();
            foreach(var item in plan) { StepState st; if(!states.TryGetValue(item.Step.Id,out st))st=StepState.NotStarted; actions.Items.Add("["+Rules.StateText(st)+"] "+item.Step.Title); }
            int next=WildsProfile.NextUntried(plan,states);
            int index=advance?next:plan.FindIndex(x=>x.Step.Id==previous);
            if(index<0)index=next;
            if(index<0)index=Math.Max(0,plan.FindIndex(x=>x.Step.Id=="wilds-records"||x.Step.Id=="game-records")); if(actions.Items.Count>0)actions.SelectedIndex=index; updating=priorUpdating; ShowAction();
            int count=current.Application.Events.Count;
            resultSummary.Text=L.T("MainForm.148")+count+L.T("MainForm.149")+current.Application.Events.Count(x=>x.Match==MatchKind.ExactPath)+L.T("MainForm.150")+current.Application.Events.Count(x=>x.Match==MatchKind.NameOnly)+L.T("MainForm.MatchSummaryClose")+Rules.StatusText(current.Application.Status)+"\n"+(count==0?(GameProfile.IsPerformance(selectedSymptom)?L.T("MainForm.151"):CaptureWorkflow.MissingRecordHint):L.T("MainForm.152"));
            resultSummary.Text+=L.T("MainForm.153");
            if(next<0)resultSummary.Text+=L.T("MainForm.154");
            if(journal.Records.Any(r=>r.Outcome==ActionOutcome.Resolved))resultSummary.Text+=L.T("MainForm.155");
            if(outcome.SelectedIndex==1)resultSummary.Text+=L.T("MainForm.156");
            RefreshReport(); UpdateButtons();
        }
        private void ShowAction()
        {
            int i=actions.SelectedIndex; if(i<0 || i>=plan.Count)return;
            var item=plan[i];
            string nextText=(item.Step.Id=="wilds-stop"||item.Step.Id=="stop")?L.T("MainForm.157"):(item.Step.Id=="wilds-records"||item.Step.Id=="game-records")?L.T("MainForm.158"):L.T("MainForm.159");
            actionDetail.Text=ForTextBox(item.Step.Title+L.T("MainForm.160")+item.Reason+L.T("MainForm.161")+item.Step.Instructions+L.T("MainForm.162")+item.Step.Warning+"\n\n"+nextText+L.T("MainForm.163")+item.Step.OfficialUrl);
            StepState st; if(!states.TryGetValue(item.Step.Id,out st))st=StepState.NotStarted; bool priorUpdating=updating; updating=true; actionState.SelectedIndex=(int)st; updating=priorUpdating;
        }
        private string ExportText(bool knownNames=false)
        {
            return GameProfile.Summary(current,GeneralAnswers(),states)+(current.Game==GameKind.Wilds?TraceEvidence.Summary(current,Answers())+CrashArchive.Summary(current.Archive,current,knownNames):L.T("MainForm.164"))+SteamEvidence.Summary(current.Steam)+journal.Summary()+"\n"+Rules.BuildReport(current,baseline,(TrialOutcome)outcome.SelectedIndex,states,false,knownNames);
        }
        private void RefreshReport()
        {
            if(current==null)return;
            report.Text=ForTextBox(L.T("Language.OriginalData")+"\n"+L.T("MainForm.165")+L.OriginalValue(current.Hardware.LocalCpuName)+"\nGPU: "+L.OriginalValue(string.Join(" / ",current.Hardware.LocalGpuNames))+"\n\n"+CrashDetails.LocalDetails(current)+"\n"+ExportText());
        }
        private void UpdateButtons()
        {
            bool idle=!busy && !measureStart.HasValue;
            language.Enabled=idle;
            consent.Enabled=profile.Enabled=symptom.Enabled=store.Enabled=idle;traceConsent.Enabled=archiveConsent.Enabled=idle&&selectedGame==GameKind.Wilds;steamConsent.Enabled=idle&&store.SelectedIndex==(int)GameStore.Steam; chooseSteam.Enabled=idle&&consent.Checked&&steamConsent.Checked&&steamConsent.Enabled; find.Enabled=idle&&consent.Checked&&selectedGame==GameKind.Wilds;choose.Enabled=idle&&consent.Checked; reset.Enabled=idle;
            recent.Enabled=idle && consent.Checked && targetPath!=null;
            recent.Text=current==null?L.T("MainForm.033"):CaptureWorkflow.RefreshButtonText;
            begin.Enabled=recent.Enabled && !sessionRestartObserved && WildsProfile.MayRetest(current,Answers());
            begin.Text=current==null?L.T("MainForm.032"):L.T("MainForm.166");
            finish.Enabled=!busy && measureStart.HasValue; cancel.Enabled=busy || measureStart.HasValue;
            retest.Enabled=idle && consent.Checked && current!=null && !sessionRestartObserved && WildsProfile.MayRetest(current,Answers()); export.Enabled=idle && current!=null; reread.Enabled=rereadFromActions.Enabled=idle&&consent.Checked&&current!=null;pickArchive.Enabled=idle&&consent.Checked&&archiveConsent.Checked&&current!=null&&current.Game==GameKind.Wilds&&selectedGame==GameKind.Wilds;
            foreach(var c in new[]{stage,worked,demo,capture,mods,textures,pcIssue,verify,scene,frequency,lowerGraphics})c.Enabled=idle;
            stage.Enabled=textures.Enabled=idle&&GameProfile.UsesWildsRules(selectedGame,selectedSymptom);lowerGraphics.Enabled=idle&&GameProfile.IsPerformance(selectedSymptom);
            actions.Enabled=actionState.Enabled=outcome.Enabled=idle && current!=null;
            guide.Enabled=official.Enabled=idle && actions.SelectedIndex>=0; UpdateHistoryButtons();
        }
        private void OpenLink(bool officialLink)
        {
            if(actions.SelectedIndex<0 || actions.SelectedIndex>=plan.Count)return;
            var step=plan[actions.SelectedIndex].Step; string url=officialLink?step.OfficialUrl:step.GuideUrl;
            if(MessageBox.Show(this,L.T("MainForm.167")+L.LinkLabel(url),L.T("MainForm.168"),MessageBoxButtons.YesNo)!=DialogResult.Yes)return;
            try { Process.Start(new ProcessStartInfo(url){UseShellExecute=true}); } catch { MessageBox.Show(this,L.T("MainForm.169")); }
        }
        private static string ForTextBox(string t) { return t.Replace("\r\n","\n").Replace("\n","\r\n"); }
        private void ShowExport()
        {
            if(current==null)return; string text=ExportText();
            using(var form=new Form { Text=L.T("MainForm.170"),Width=950,Height=700,StartPosition=FormStartPosition.CenterParent,Font=Font })
            {
                var box=ReadBox(); box.Text=ForTextBox(text);
                var bottom=Flow(); bottom.Dock=DockStyle.Bottom;
                bottom.Controls.Add(Label(L.T("MainForm.171")));
                var known=new CheckBox { Text=L.T("MainForm.172"),AutoSize=true };
                var confirm=new CheckBox { Text=L.T("MainForm.173"),AutoSize=true }; var save=Button(L.T("MainForm.174")); save.Enabled=false; confirm.CheckedChanged+=(s,e)=>save.Enabled=confirm.Checked;
                known.CheckedChanged+=(s,e)=>{text=ExportText(known.Checked);box.Text=ForTextBox(text);confirm.Checked=false;};
                save.Click+=(s,e)=> {
                    using(var d=new SaveFileDialog { Filter=L.T("MainForm.175"),FileName="gemnao-game-diagnosis.txt",InitialDirectory=Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),OverwritePrompt=true,AddExtension=true,RestoreDirectory=true })
                    {
                        if(d.ShowDialog(form)!=DialogResult.OK)return;
                        try { if(!LocalGuard.Allowed(d.FileName,true)) { MessageBox.Show(form,L.T("MainForm.176")); return; } File.WriteAllText(d.FileName,text,new UTF8Encoding(true)); MessageBox.Show(form,L.T("MainForm.177")); form.Close(); }
                        catch { MessageBox.Show(form,L.T("MainForm.178")); }
                    }
                };
                bottom.Controls.Add(known); bottom.Controls.Add(confirm); bottom.Controls.Add(save); form.Controls.Add(box); form.Controls.Add(bottom); form.ShowDialog(this);
            }
        }
    }
}
