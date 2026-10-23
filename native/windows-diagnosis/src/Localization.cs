using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Resources;

namespace Gemnao.Diagnostics
{
    // Display language only. Never used as a parser, rule, history or evidence key.
    // Both resource sets are embedded in the EXE, so no satellite DLL is required.
    public static class L
    {
        private static readonly ResourceManager English = new ResourceManager("Gemnao.Diagnostics.Resources.Strings.en", typeof(L).Assembly);
        private static readonly ResourceManager Japanese = new ResourceManager("Gemnao.Diagnostics.Resources.Strings.ja", typeof(L).Assembly);
        public static string Language { get; private set; } = "en";
        public static string ResolveLanguage(string name)
        {
            return !string.IsNullOrEmpty(name) && (string.Equals(name,"ja",StringComparison.OrdinalIgnoreCase) || name.StartsWith("ja-",StringComparison.OrdinalIgnoreCase)) ? "ja" : "en";
        }
        public static void SetLanguage(string name) { Language=ResolveLanguage(name); }
        public static string T(string key) { return Text(key,Language); }
        public static string Text(string key,string language)
        {
            string text=null;
            if(ResolveLanguage(language)=="ja")text=Japanese.GetString(key,CultureInfo.InvariantCulture);
            return text ?? English.GetString(key,CultureInfo.InvariantCulture) ?? "["+key+"]";
        }
        public static IEnumerable<string> Keys
        {
            get { return English.GetResourceSet(CultureInfo.InvariantCulture,true,true).Cast<DictionaryEntry>().Select(x=>(string)x.Key).OrderBy(x=>x,StringComparer.Ordinal).ToArray(); }
        }
        public static bool HasExactResource(string key,string language)
        {
            return (ResolveLanguage(language)=="ja"?Japanese:English).GetResourceSet(CultureInfo.InvariantCulture,true,true).GetString(key)!=null;
        }
        // Only call on application-owned UI labels and fixed choices, never raw evidence.
        // Dynamic reports are regenerated from their typed data instead of translated in place.
        public static string TranslateUiText(string value,string previousLanguage)
        {
            foreach(string key in Keys)if(string.Equals(value,Text(key,previousLanguage),StringComparison.Ordinal))return T(key);
            return value;
        }
        public static string OriginalValue(string value) { return string.IsNullOrEmpty(value)?T("Core.001"):value; }
        public static string GuideUrl(string url)
        {
            if(Language!="en")return url;
            const string site="https://gemnao.pages.dev";
            if(url==site+"/guide/pc-game-crash")return site+"/en/guide/pc-game-crash";
            if(url==site+"/games/monster-hunter-wilds/not-launching")return site+"/en/games/monster-hunter-wilds/not-launching";
            if(url==site+"/games/monster-hunter-wilds/system-requirements")return site+"/en/games/monster-hunter-wilds#requirements";
            // Do not invent translated pages or carry fragment IDs across different articles.
            if(url.StartsWith(site+"/games/monster-hunter-wilds/not-launching#",StringComparison.Ordinal))return site+"/en/games/monster-hunter-wilds/not-launching";
            return url;
        }
        public static string LinkLabel(string url)
        {
            return Language=="en" && url.StartsWith("https://gemnao.pages.dev/",StringComparison.Ordinal) && !url.StartsWith("https://gemnao.pages.dev/en/",StringComparison.Ordinal) ? url+" (Japanese)" : url;
        }
        public static string OfficialUrl(string url)
        {
            if(Language!="en")return url;
            return url.Replace("https://help.steampowered.com/ja/","https://help.steampowered.com/en/").Replace("https://learn.microsoft.com/ja-jp/","https://learn.microsoft.com/en-us/").Replace("https://support.microsoft.com/ja-jp/","https://support.microsoft.com/en-us/");
        }
    }
}
