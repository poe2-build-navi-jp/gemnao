using System;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace Gemnao.Diagnostics
{
    internal sealed partial class MainForm
    {
        private readonly ComboBox language=new ComboBox { DropDownStyle=ComboBoxStyle.DropDownList,Width=150,AccessibleName="Language / 言語" };
        private void BuildLanguageSelector(FlowLayoutPanel header)
        {
            language.Items.AddRange(new object[]{"English","日本語"});
            language.SelectedIndex=L.Language=="ja"?1:0;
            var title=Label("Language / 言語");
            header.Controls.Add(Row(title,language));
            header.Controls.Add(Label(L.T("Language.SessionOnly")));
            language.SelectedIndexChanged+=(s,e)=>ChangeLanguage();
        }
        private void ChangeLanguage()
        {
            if(updating || busy || measureStart.HasValue)return;
            string next=language.SelectedIndex==1?"ja":"en";
            if(next==L.Language)return;
            string previous=L.Language;
            string elapsedBefore=elapsed.Text;
            int historyIndex=historyAction.SelectedIndex;
            int draftState=historyState.SelectedIndex,draftOutcome=historyOutcome.SelectedIndex;
            updating=true;
            try
            {
                L.SetLanguage(next);
                TranslateControls(this,previous);
                Text=L.T("MainForm.050")+Rules.Version+"-rc.2";
                if(targetPath!=null)targetLabel.Text=L.T("MainForm.099")+Rules.LocalLabel(targetPath);
                else targetLabel.Text=L.TranslateUiText(targetLabel.Text,previous);
                string oldPrefix=L.Text("MainForm.053",previous);
                if(elapsedBefore.StartsWith(oldPrefix,StringComparison.Ordinal))elapsed.Text=L.T("MainForm.053")+elapsedBefore.Substring(oldPrefix.Length);
                // Fixed choices keep the same indices: enums and game scope never change.
                historyAction.Items.Clear();historyAction.Items.AddRange(GameProfile.Catalog(selectedGame,selectedSymptom).Select(x=>(object)x.Title).ToArray());
                historyAction.SelectedIndex=historyIndex;
                if(current!=null)RefreshResults();
                historyReport.Text=ForTextBox(journal.Summary());
                historyState.SelectedIndex=draftState;historyOutcome.SelectedIndex=draftOutcome;
            }
            finally { updating=false;UpdateButtons(); }
        }
        private void TranslateControls(Control control,string previous)
        {
            // Selected paths and raw local names are never fed to the text lookup.
            if(!(control is TextBox) && control!=targetLabel && control!=language)
            {
                if(control is ComboBox)
                {
                    var combo=(ComboBox)control;int selected=combo.SelectedIndex;
                    for(int i=0;i<combo.Items.Count;i++)combo.Items[i]=L.TranslateUiText((string)combo.Items[i],previous);
                    combo.SelectedIndex=selected;
                }
                else if(!(control is ListBox))control.Text=L.TranslateUiText(control.Text,previous);
            }
            foreach(Control child in control.Controls)TranslateControls(child,previous);
        }
        private static void FitFlow(FlowLayoutPanel flow,TabPage page)
        {
            Action resize=()=>{
                int width=Math.Max(300,page.ClientSize.Width-SystemInformation.VerticalScrollBarWidth-35);
                foreach(Control c in flow.Controls)
                {
                    if(c is Label || c is CheckBox || c is FlowLayoutPanel)c.MaximumSize=new Size(width,0);
                    if(c is FlowLayoutPanel)foreach(Control inner in c.Controls)if(inner is Label)inner.MaximumSize=new Size(width,0);
                }
            };
            page.SizeChanged+=(s,e)=>resize();resize();
        }
    }
}
