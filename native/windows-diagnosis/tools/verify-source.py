#!/usr/bin/env python3
"""Source guardrails; no claim that this replaces a Windows execution test."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
source = '\n'.join(p.read_text(encoding='utf-8') for p in (root / 'src').glob('*.cs'))
for token in ['HttpClient', 'WebClient', 'WebRequest', 'TcpClient', 'UdpClient', 'InvokeExpression', 'EncodedCommand', 'ExecutionPolicy', 'ServiceController', 'FormatDescription', 'WriteEvent', 'ClearLog', 'SetAccessControl', 'InvokeMethod', 'SetValue(', 'DeleteValue(', 'CreateSubKey(', 'DeleteSubKey', 'GetValueNames(', 'GetSubKeyNames(', 'File.Delete(', 'File.Copy(', 'GetProcesses(', 'Kill(', 'CloseMainWindow(', 'Directory.Delete(', 'SearchOption.AllDirectories']:
    assert token not in source, 'Forbidden operation: ' + token
collector = (root / 'src/WindowsCollector.cs').read_text(encoding='utf-8')
local = (root / 'src/WildsLocal.cs').read_text(encoding='utf-8')
optional = (root / "src/OptionalChecks.cs").read_text(encoding="utf-8")
steam = (root / "src/SteamLocal.cs").read_text(encoding="utf-8")
history = (root / "src/HistoryLocal.cs").read_text(encoding="utf-8")
for code in [collector, local, optional, steam]:
    assert 'Process.Start' not in code and 'File.Write' not in code
    assert 'SELECT *' not in code
    for field in ['SerialNumber', 'ProcessorId', 'PNPDeviceID', 'RegisteredUser', 'CSName', 'UserName', 'MachineName', 'AdapterRAM']:
        assert field not in code, 'Unnecessary field: ' + field
assert 'ReverseDirection = true' in collector and 'MaxEventsPerLog' in collector
assert 'MaxCharactersInDocument = 65536' in source and 'DtdProcessing = DtdProcessing.Prohibit' in source and 'XmlResolver = null' in source
assert 'FileMode.Open,FileAccess.Read' in local and 'SearchOption.TopDirectoryOnly' in local
assert 'total++>=64' in local and '.Take(16)' in local
assert 'GetValue("SteamPath")' in local and 'GetValue(game)' in local
assert 'level="asInvoker"' in (root / 'app.manifest').read_text()
assert source.count('Process.Start(') == 1, 'Only explicit confirmed guide launch'
assert source.count('File.WriteAllText(') == 1, 'Only preview-confirmed export'
assert 'confirm.Checked' in source and 'OverwritePrompt=true' in source
assert 'WildsProfile.MayRetest(current,Answers())' in source
assert 'WildsProfile.AcceptsCapture(s,targetSession,token.IsCancellationRequested)' in source
assert 'token.ThrowIfCancellationRequested()' in source
assert 'Task.Delay(5000,token)' in source
assert source.count('if(!CaptureWorkflow.CanRefresh(current,end))') == 2
assert 'Collect(current.StartUtc,end,false,CaptureMode.Refresh)' in source
assert 'if(current!=null) { await RefreshCapture(); return; }' in source
assert 'readTraces,readArchive' in source
assert 'known.CheckedChanged' in source and 'confirm.Checked=false' in source
assert 'ExtractTo' not in source
assert 'event.evtx' not in (root / 'src/CrashArchive.cs').read_text()
print('PASS source guardrails: no network/repair/registry-write APIs; bounded read-only metadata; consent, retest safety, preview export, asInvoker')

# New writes are restricted to the app's own optional history, never game/Steam files.
for path in (root / 'src').glob('*.cs'):
    code = path.read_text(encoding='utf-8')
    if path.name != 'HistoryLocal.cs':
        for token in ['File.Move(', 'File.Replace(', 'Directory.CreateDirectory(', 'FileSystem.DeleteFile(']:
            assert token not in code, token + ' outside own history store'
assert 'Process.GetProcessesByName("steam")' in steam and source.count('GetProcessesByName(') == 1
assert 'processes.Take(4)' in steam and 'Math.Min(1024,modules.Count)' in steam and 'TimeSpan.FromSeconds(10)' in steam
assert 'process.MainModule?.FileName' in steam and 'string.Equals(Path.GetFullPath(exe),steam' in steam
assert 'DataProtectionScope.CurrentUser' in history and 'Environment.SpecialFolder.LocalApplicationData' in history
assert 'RecycleOption.SendToRecycleBin' in history and 'UIOption.AllDialogs' in history and 'history-v2.dat' in history
assert 'PublicIntakeVerified=false' in source and 'website.Enabled=false' in source
assert 'steamConsent.Checked' in source and 'historyConsent.Checked' in source
assert '<PlatformTarget>x64</PlatformTarget>' in (root / 'Gemnao.Diagnostics.csproj').read_text()
print('PASS 0.4 guards: scoped Steam process metadata, separate consents, own-user protected history, disabled web intake, x64')

# 0.5 generic routing and strict separation of special reads/history.
general=(root/'src/GameProfile.cs').read_text(encoding='utf-8')
ui=(root/'src/MainForm.cs').read_text(encoding='utf-8')
hui=(root/'src/MainFormHistory.cs').read_text(encoding='utf-8')
assert 'GameProfile.Accepts(targetPath,gameKind)' in collector
assert 'gameKind==GameKind.Wilds' in collector and 'if(wildsProfile && WildsProfile.IsTarget(game))' in local
assert 'current.Game!=GameKind.Wilds' in ui and 'selectedGame!=GameKind.Wilds' in ui
assert 'if(!GameProfile.UsesWildsRules(selectedGame,selectedSymptom))return;' in hui
assert 'saved.Matches(targetPath,selectedGame,selectedSymptom)' in hui
assert 'ClearGameAnswers();steamConsent.Checked=false;' in ui
assert 'private void ChangeStore()' in ui and 'steamConsent.Checked=false;steamExe=null;' in ui
assert 'HMACSHA256' in source and 'new XAttribute("schema","2")' in source
assert 'GameDiagnosis' in history and 'history-v2.dat' in history and 'WildsDiagnosis' not in history
assert 'L.T("GameProfile.080")' in general or 'L.T("GameProfile.081")' in general
assert 'FPS・フレーム時間・GPU使用率・温度は測定していません' in (root/'Resources/Strings.ja.resx').read_text(encoding='utf-8')
print('PASS 0.5 guards: arbitrary local EXE, fixed symptom plans, Wilds-only additional parsing, distinct local history binding, generic feedback disabled')

# 0.6 display localization must never become an evidence key or new side effect.
import re
import xml.etree.ElementTree as ET
resources={}
for language in ['en','ja']:
    tree=ET.parse(root/('Resources/Strings.'+language+'.resx'))
    entries=tree.findall('data')
    resources[language]={entry.attrib['name']:entry.findtext('value') for entry in entries}
    assert len(entries)==len(resources[language]), 'Duplicate resource key'
assert resources['en'].keys()==resources['ja'].keys()
assert len(resources['en'])>=690
for key,value in resources['en'].items():
    assert value and not re.search('[\u3040-\u30ff\u3400-\u9fff]',value), 'Missing English: '+key
for key in re.findall(r'L\.(?:T|Text)\("([^"]+)"',source):
    assert key in resources['en'], 'Unknown resource: '+key
for file in (root/'src').glob('*.cs'):
    if file.name=='MainFormLocalization.cs':continue # bilingual language names only
    assert not re.search('[\u3040-\u30ff\u3400-\u9fff]',file.read_text()), 'Unextracted Japanese: '+file.name
assert 'Rules.NumericVersionValue(x.DriverVersion)!=null' in (root/'src/ActionHistory.cs').read_text()
assert 'Rules.NumericVersionValue(versions[0])!=null' in (root/'src/FeedbackExport.cs').read_text()
assert 'Rules.NumericVersionValue(o["DriverVersion"])' in collector
assert 'Rules.VendorCode(o["AdapterCompatibility"])' in collector
localization=(root/'src/MainFormLocalization.cs').read_text()
assert 'if(updating || busy || measureStart.HasValue)return;' in localization
assert 'language.Enabled=idle' in ui
for assignment in ['current=','baseline=','targetSession=','measureStart=','sessionRestartObserved=','journal.Record','states.Clear','Checked=','targetPath=']:
    assert assignment not in localization, 'Language switch mutates evidence: '+assignment
assert 'if(updating||historyAction.SelectedIndex<0)return;' in hui
assert 'historyState.SelectedIndex=draftState;historyOutcome.SelectedIndex=draftOutcome;' in localization
assert 'control!=targetLabel' in localization and '!(control is TextBox)' in localization
assert 'updating=priorUpdating' in ui
assert 'L.SetLanguage(System.Globalization.CultureInfo.CurrentUICulture.Name)' in (root/'src/Program.cs').read_text()
print('PASS 0.6 guards: '+str(len(resources['en']))+' bilingual embedded resources, invariant unknowns, idle-only language switch, preserved consent/evidence/history, raw names untouched')
