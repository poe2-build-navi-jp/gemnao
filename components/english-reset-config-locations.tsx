import { PathCopy } from './path-copy';
const examples = [
 {game:'Elden Ring (Steam)',folder:String.raw`%APPDATA%\EldenRing`,file:'GraphicsConfig.xml',note:'Move only this identified graphics XML. Keep the numbered save-data folder separate. This location is documented by a mod author, not publisher support.'},
 {game:'Monster Hunter Wilds (Steam retail)',folder:String.raw`C:\Program Files (x86)\Steam\steamapps\common\MonsterHunterWilds`,file:'config.ini',note:'This is the default Steam installation path. If installed elsewhere, use Steam → Manage → Browse local files to locate the actual game folder. Capcom identifies config.ini there for graphics troubleshooting; this is not the save folder.'},
 {game:'Fortnite (Windows)',folder:String.raw`%LOCALAPPDATA%\FortniteGame\Saved\Config\WindowsClient`,file:'GameUserSettings.ini',note:'When settings will not save, first follow Epic’s targeted procedure: open this file’s Properties, clear Read-only and select Apply. A complete reset is not the first step for that symptom.'},
];
export function EnglishResetConfigLocations() {
 return <section className="pc-step reset-config-details" id="config-location">
 <h2>Three game-specific configuration locations</h2>
 <p>Copy the folder path into File Explorer’s address bar and press Enter, then identify the named file. Confirm your game version and store first.</p>
 {examples.map(e=><div className="reset-examples" key={e.file}><h3>{e.game}: {e.file}</h3><p><code style={{overflowWrap:'anywhere'}}>{e.folder}</code> <PathCopy value={e.folder} english /></p><p>{e.note}</p></div>)}
 <p>These are Windows examples checked against the sources below; no in-game reset was performed for this article. AppData can be opened directly using the path even when hidden.</p>
 <details><summary>Game or folder not listed?</summary><p>Use the exact PC edition and store’s support instructions. Settings may appear after the first launch or a normal exit, or be managed outside a standalone file. Do not create a guessed file or move a whole data folder.</p></details>
 </section>;
}
