using System;
using System.Drawing;
using System.IO;
using System.Text;
using System.Windows.Forms;
namespace Gemnao.Diagnostics
{
    internal sealed partial class MainForm
    {
        private readonly Button privateExport=Button(L.T("Private.Export"));
        private void ShowPrivateExport()
        {
            if(current==null||busy||measureStart.HasValue)return;
            string json;
            try { json=PrivateDiagnosticExport.Build(current,Answers(),(TrialOutcome)outcome.SelectedIndex,ResultOverview.Next(plan,states)?.Step.Id); }
            catch { MessageBox.Show(this,L.T("Private.Invalid"));return; }
            using(var form=new Form{Text=L.T("Private.Export"),Width=950,Height=700,StartPosition=FormStartPosition.CenterParent,Font=Font})
            {
                var preview=ReadBox();preview.Text=ForTextBox(json);
                var bottom=Flow();bottom.Dock=DockStyle.Bottom;bottom.MaximumSize=new Size(900,0);
                bottom.Controls.Add(Label(L.T("Private.Explain")));
                var confirm=new CheckBox{Text=L.T("Private.Confirm"),AutoSize=true};
                var save=Button(L.T("Private.Save"));save.Enabled=false;confirm.CheckedChanged+=(s,e)=>save.Enabled=confirm.Checked;
                save.Click+=(s,e)=>{
                    using(var dialog=new SaveFileDialog{Filter="JSON (*.json)|*.json",FileName="gemnao-private-diagnostic.json",InitialDirectory=Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),OverwritePrompt=true,AddExtension=true,RestoreDirectory=true})
                    {
                        if(dialog.ShowDialog(form)!=DialogResult.OK)return;
                        try{
                            if(!LocalGuard.Allowed(dialog.FileName,true))throw new IOException();
                            using(var file=new FileStream(dialog.FileName,FileMode.Create,FileAccess.Write,FileShare.None)){var bytes=new UTF8Encoding(false,true).GetBytes(json);file.Write(bytes,0,bytes.Length);}
                            MessageBox.Show(form,L.T("Private.Saved"));
                        }catch{MessageBox.Show(form,L.T("Private.SaveFailed"));}
                    }
                };
                var web=Button(L.T("Private.Web"));web.Click+=(s,e)=>OpenApprovedLink(PrivateDiagnosticExport.PageUrl);
                bottom.Controls.Add(confirm);bottom.Controls.Add(save);bottom.Controls.Add(web);form.Controls.Add(preview);form.Controls.Add(bottom);form.ShowDialog(this);
            }
        }
    }
}
