using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Gemnao.Diagnostics
{
    internal sealed partial class MainForm
    {
        private ActionJournal journal=new ActionJournal();
        private string retestActionId;
        private readonly CheckBox historyConsent=new CheckBox{Text=L.T("MainFormHistory.001"),AutoSize=true,MaximumSize=new Size(940,0)};
        private readonly ComboBox historyAction=Combo(GameProfile.Steps.Select(x=>x.Title).ToArray());
        private readonly ComboBox historyState=Combo(L.T("MainFormHistory.002"),L.T("MainFormHistory.003"),L.T("MainFormHistory.004"),L.T("MainFormHistory.005"));
        private readonly ComboBox historyOutcome=Combo(L.T("MainFormHistory.006"),L.T("MainFormHistory.007"),L.T("MainFormHistory.008"),L.T("MainFormHistory.009"),L.T("MainFormHistory.010"),L.T("MainFormHistory.011"),L.T("MainFormHistory.012"));
        private readonly Button recordHistory=Button(L.T("MainFormHistory.013"));
        private readonly Button saveHistory=Button(L.T("MainFormHistory.014"));
        private readonly Button loadHistory=Button(L.T("MainFormHistory.015"));
        private readonly Button clearHistory=Button(L.T("MainFormHistory.016"));
        private readonly Button feedbackExport=Button(L.T("MainFormHistory.017"));
        private readonly TextBox historyReport=ReadBox();
        private void BuildHistoryTab()
        {
            var page=new TabPage(L.T("MainFormHistory.018")){AutoScroll=true};var grid=new TableLayoutPanel{Dock=DockStyle.Top,AutoSize=true,ColumnCount=1,RowCount=4,Padding=new Padding(8)};
            grid.RowStyles.Add(new RowStyle(SizeType.AutoSize));grid.RowStyles.Add(new RowStyle(SizeType.AutoSize));grid.RowStyles.Add(new RowStyle(SizeType.Absolute,240));grid.RowStyles.Add(new RowStyle(SizeType.AutoSize));
            var top=Flow();top.Controls.Add(Label(L.T("MainFormHistory.019")));
            top.Controls.Add(Row(historyAction,historyState));top.Controls.Add(Row(historyOutcome,recordHistory));grid.Controls.Add(top,0,0);
            var privacy=Flow();privacy.Controls.Add(Label(L.T("MainFormHistory.020")));privacy.Controls.Add(historyConsent);privacy.Controls.Add(Label(L.T("MainFormHistory.021")));privacy.Controls.Add(Row(saveHistory,loadHistory,clearHistory));grid.Controls.Add(privacy,0,1);
            grid.Controls.Add(historyReport,0,2);
            var bottom=Flow();bottom.Controls.Add(Label(L.T("MainFormHistory.022")));bottom.Controls.Add(feedbackExport);var website=Button(L.T("MainFormHistory.023"));website.Enabled=false;bottom.Controls.Add(website);grid.Controls.Add(bottom,0,3);page.Controls.Add(grid);tabs.TabPages.Add(page);
            Action resize=()=>{int width=Math.Max(350,page.ClientSize.Width-SystemInformation.VerticalScrollBarWidth-24);grid.Width=width;foreach(var flow in new[]{top,privacy,bottom}){flow.MaximumSize=new Size(width-20,0);foreach(Control c in flow.Controls)if(c is Label||c is CheckBox||c is FlowLayoutPanel)c.MaximumSize=new Size(width-40,0);}};page.SizeChanged+=(s,e)=>resize();resize();
            historyConsent.CheckedChanged+=(s,e)=>UpdateHistoryButtons();historyAction.SelectedIndexChanged+=(s,e)=>ShowHistoryAction();
            recordHistory.Click+=(s,e)=>{var step=GameProfile.Catalog(selectedGame,selectedSymptom)[historyAction.SelectedIndex];var state=(StepState)historyState.SelectedIndex;var result=(ActionOutcome)historyOutcome.SelectedIndex;if(!ActionJournal.Consistent(state,result)){MessageBox.Show(this,L.T("MainFormHistory.024"));return;}journal.Record(step.Id,state,result);states[step.Id]=state;RefreshResults();RefreshJournal();};
            saveHistory.Click+=(s,e)=>SaveJournal();loadHistory.Click+=(s,e)=>LoadJournal();clearHistory.Click+=(s,e)=>RecycleJournal();feedbackExport.Click+=(s,e)=>ShowFeedbackExport();RefreshJournal();
        }
        private void UpdateHistoryButtons()
        {
            bool idle=!busy&&!measureStart.HasValue;
            historyConsent.Enabled=historyAction.Enabled=historyState.Enabled=historyOutcome.Enabled=idle;recordHistory.Enabled=idle&&targetPath!=null;
            saveHistory.Enabled=idle&&historyConsent.Checked&&journal.Records.Count>0;loadHistory.Enabled=idle&&historyConsent.Checked&&targetPath!=null;clearHistory.Enabled=idle&&historyConsent.Checked;
            feedbackExport.Enabled=idle&&GameProfile.UsesWildsRules(selectedGame,selectedSymptom)&&journal.Records.Any(x=>x.Outcome!=ActionOutcome.Unrecorded);
        }
        private void ResetHistoryCatalog(){historyAction.Items.Clear();historyAction.Items.AddRange(GameProfile.Catalog(selectedGame,selectedSymptom).Select(x=>(object)x.Title).ToArray());historyAction.SelectedIndex=0;}
        private void ShowHistoryAction()
        {
            if(updating||historyAction.SelectedIndex<0)return;var r=journal.Latest(GameProfile.Catalog(selectedGame,selectedSymptom)[historyAction.SelectedIndex].Id);
            historyState.SelectedIndex=r==null?0:(int)r.State;historyOutcome.SelectedIndex=r==null?0:(int)r.Outcome;
        }
        private void RefreshJournal(){historyReport.Text=ForTextBox(journal.Summary());ShowHistoryAction();UpdateHistoryButtons();}
        private void SaveJournal()
        {
            if(!historyConsent.Checked||busy||measureStart.HasValue)return;
            if(MessageBox.Show(this,L.T("MainFormHistory.025"),L.T("MainFormHistory.026"),MessageBoxButtons.YesNo,MessageBoxIcon.Information,MessageBoxDefaultButton.Button2)!=DialogResult.Yes)return;
            try{HistoryLocal.Save(journal);MessageBox.Show(this,L.T("MainFormHistory.027"));}catch{MessageBox.Show(this,L.T("MainFormHistory.028"));}
        }
        private void LoadJournal()
        {
            if(!historyConsent.Checked||busy||measureStart.HasValue)return;
            ActionJournal saved;try{saved=HistoryLocal.Load();}catch{MessageBox.Show(this,L.T("MainFormHistory.029"));return;}
            if(!saved.Matches(targetPath,selectedGame,selectedSymptom)){MessageBox.Show(this,L.T("MainFormHistory.030"));return;}
            using(var dialog=new Form{Text=L.T("MainFormHistory.031"),Width=900,Height=650,StartPosition=FormStartPosition.CenterParent,Font=Font})
            {
                var text=ReadBox();text.Text=ForTextBox(saved.Summary());var bottom=Flow();bottom.Dock=DockStyle.Bottom;bottom.Controls.Add(Label(L.T("MainFormHistory.032")));var okay=new CheckBox{Text=L.T("MainFormHistory.033"),AutoSize=true};var load=Button(L.T("MainFormHistory.034"));load.Enabled=false;okay.CheckedChanged+=(s,e)=>load.Enabled=okay.Checked;load.Click+=(s,e)=>dialog.DialogResult=DialogResult.OK;bottom.Controls.Add(okay);bottom.Controls.Add(load);dialog.Controls.Add(text);dialog.Controls.Add(bottom);
                if(dialog.ShowDialog(this)!=DialogResult.OK)return;
            }
            journal=saved;states.Clear();foreach(var r in journal.Records)states[r.ActionId]=r.State;current=baseline=null;targetSession=Guid.NewGuid();retestActionId=pendingRetestActionId=null;updating=true;outcome.SelectedIndex=0;updating=false;plan.Clear();actions.Items.Clear();report.Clear();actionDetail.Clear();resultSummary.Text=L.T("MainFormHistory.035");RefreshJournal();UpdateButtons();
        }
        private void RecycleJournal()
        {
            if(!historyConsent.Checked||busy||measureStart.HasValue)return;
            if(MessageBox.Show(this,L.T("MainFormHistory.036"),L.T("MainFormHistory.016"),MessageBoxButtons.YesNo,MessageBoxIcon.Information,MessageBoxDefaultButton.Button2)!=DialogResult.Yes)return;
            try{HistoryLocal.RecycleSavedHistory();MessageBox.Show(this,L.T("MainFormHistory.037"));}catch{MessageBox.Show(this,L.T("MainFormHistory.038"));}
        }
        private void ShowFeedbackExport()
        {
            if(!GameProfile.UsesWildsRules(selectedGame,selectedSymptom))return;
            var records=journal.Records.GroupBy(x=>x.ActionId).Select(g=>g.Last()).Where(x=>x.Outcome!=ActionOutcome.Unrecorded&&FeedbackExport.AllowedActions.Contains(x.ActionId)).ToArray();if(records.Length==0)return;
            using(var form=new Form{Text=L.T("MainFormHistory.039"),Width=960,Height=760,StartPosition=FormStartPosition.CenterParent,Font=Font})
            {
                var list=new CheckedListBox{Dock=DockStyle.Top,Height=150,CheckOnClick=true};foreach(var r in records)list.Items.Add(WildsProfile.Steps.First(x=>x.Id==r.ActionId).Title+" / "+ActionJournal.OutcomeText(r.Outcome),false);
                var preview=ReadBox();var bottom=Flow();bottom.Dock=DockStyle.Bottom;bottom.Controls.Add(Label(L.T("MainFormHistory.040")));
                var symptom=Combo(L.T("MainFormHistory.041"),L.T("MainFormHistory.042"),L.T("MainFormHistory.043"),L.T("MainFormHistory.044"),L.T("MainFormHistory.045"),L.T("MainFormHistory.046"));
                var environment=new CheckBox{Text=L.T("MainFormHistory.047"),AutoSize=true,Enabled=current!=null};var confirm=new CheckBox{Text=L.T("MainFormHistory.048"),AutoSize=true};var save=Button(L.T("MainFormHistory.049"));save.Enabled=false;string json=null;
                Action update=()=>{confirm.Checked=false;try{var selected=list.CheckedIndices.Cast<int>().Select(i=>records[i]).ToArray();json=FeedbackExport.Build(selected,current,environment.Checked,FeedbackExport.Symptoms[symptom.SelectedIndex]);preview.Text=ForTextBox(json);}catch{json=null;preview.Text=L.T("MainFormHistory.050");}save.Enabled=false;};
                list.ItemCheck+=(s,e)=>{confirm.Checked=false;save.Enabled=false;json=null;if(form.IsHandleCreated&&!form.IsDisposed)form.BeginInvoke((MethodInvoker)(()=>{if(!form.IsDisposed)update();}));};symptom.SelectedIndexChanged+=(s,e)=>update();environment.CheckedChanged+=(s,e)=>update();confirm.CheckedChanged+=(s,e)=>save.Enabled=confirm.Checked&&json!=null;
                save.Click+=(s,e)=>{using(var dialog=new SaveFileDialog{Filter="JSON (*.json)|*.json",FileName="gemnao-feedback.json",InitialDirectory=Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),OverwritePrompt=true,AddExtension=true,RestoreDirectory=true}){if(dialog.ShowDialog(form)!=DialogResult.OK)return;try{if(!LocalGuard.Allowed(dialog.FileName,true))throw new IOException();using(var file=new FileStream(dialog.FileName,FileMode.Create,FileAccess.Write,FileShare.None)){byte[] data=new UTF8Encoding(false,true).GetBytes(json);file.Write(data,0,data.Length);}MessageBox.Show(form,L.T("MainFormHistory.051"));form.Close();}catch{MessageBox.Show(form,L.T("MainFormHistory.052"));}}};
                bottom.Controls.Add(symptom);bottom.Controls.Add(environment);bottom.Controls.Add(confirm);bottom.Controls.Add(save);form.Controls.Add(preview);form.Controls.Add(list);form.Controls.Add(bottom);update();form.ShowDialog(this);
            }
        }
    }
}
