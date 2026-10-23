using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;

namespace Gemnao.Diagnostics
{
    public enum ReadStatus { NotRead, Complete, AccessDenied, Unavailable, TimedOut, Partial, Cancelled }
    public enum EventKind { ApplicationCrash, ApplicationHang, DisplayRecovery, UncleanRestart }
    public enum MatchKind { ExactPath, NameOnly, SystemContext }
    public enum ModuleKind { Unknown, WindowsCore, Graphics, VisualCpp, Other, TargetExecutable, SteamOverlay }
    public enum ParseOutcome { Accepted, NotTarget, Unsupported, Malformed }
    public enum TrialOutcome { NotTested, Better, Same, Worse, Unsure }
    public enum StepState { NotStarted, Checked, Tried, Skipped }

    public sealed class EventFact
    {
        public EventKind Kind;
        public MatchKind Match;
        public ModuleKind Module;
        public DateTime TimeUtc;
        public string LocalModuleName = "";
        public bool ModuleNameUnavailable;
        internal string ModuleIdentityToken = "";
        public MatchKind ModuleTargetMatch = MatchKind.NameOnly;
        public int[] AppVersionParts = new int[0];
        public int[] ModuleVersionParts = new int[0];
        public ulong? FaultOffset;
        public string ExceptionCode = ""; // Exactly eight hex digits, never free text.
    }
    public sealed class LogFacts
    {
        public ReadStatus Status = ReadStatus.NotRead;
        public int Examined;
        public int Unsupported;
        public bool LimitReached;
        public readonly List<EventFact> Events = new List<EventFact>();
    }
    public sealed class GpuFact
    {
        public string Vendor;
        public string DriverVersion;
    }
    public sealed class DiskFact
    {
        public bool IsSystem;
        public long? FreeMiB;
        public long? TotalMiB;
    }
    public sealed class HardwareFacts
    {
        public ReadStatus OsStatus = ReadStatus.NotRead;
        public ReadStatus CpuStatus = ReadStatus.NotRead;
        public ReadStatus GpuStatus = ReadStatus.NotRead;
        public ReadStatus DiskStatus = ReadStatus.NotRead;
        public string OsVersion;
        public string CpuVendor;
        public int? LogicalProcessors;
        public long? TotalMemoryMiB;
        public long? FreeMemoryMiB;
        public readonly List<GpuFact> Gpus = new List<GpuFact>();
        public readonly List<DiskFact> Disks = new List<DiskFact>();
        // Display-only, never passed to the export formatter.
        public string LocalCpuName;
        public readonly List<string> LocalGpuNames = new List<string>();
    }
    public sealed class Snapshot
    {
        public GameKind Game;
        public GameSymptom Symptom;
        public DateTime StartUtc;
        public DateTime EndUtc;
        public DateTime CollectedUtc;
        // Session-local opaque identity prevents accidental cross-target comparisons; never exported.
        public Guid TargetSession;
        internal Guid AttemptId;
        public CaptureOrigin Origin;
        public int RefreshCount;
        public bool PriorRestartObserved;
        public CrashArchiveFacts Archive = new CrashArchiveFacts();
        public readonly SteamFacts Steam = new SteamFacts();
        public readonly WildsFacts Wilds = new WildsFacts();
        public readonly HardwareFacts Hardware = new HardwareFacts();
        public readonly LogFacts Application = new LogFacts();
        public readonly LogFacts System = new LogFacts();
    }
    public sealed class Finding
    {
        public string Evidence;
        public string Candidate;
        public string Unknown;
        public string StepId;
    }
    public sealed class GuideStep
    {
        public string Id;
        public string Title;
        public string Instructions;
        public string Warning;
        private string guideUrl,officialUrl;
        public string GuideUrl { get { return L.GuideUrl(guideUrl); } set { guideUrl=value; } }
        public string OfficialUrl { get { return L.OfficialUrl(officialUrl); } set { officialUrl=value; } }
    }
    public static class Rules
    {
        public const string Version = "0.6.0";
        public const int MaxEventsPerLog = 300;
        public const int MaxWindowHours = 24;
        public static string NumericVersion(object value) { return NumericVersionValue(value) ?? L.T("Core.001"); }
        public static string NumericVersionValue(object value)
        {
            string s = Convert.ToString(value, CultureInfo.InvariantCulture) ?? "";
            if (!Regex.IsMatch(s, @"\A[0-9]{1,6}(\.[0-9]{1,6}){1,4}\z")) return null;
            var parts = s.Split('.');
            // Fail closed for an IPv4-shaped string, even if an old version could look identical.
            if (parts.Length == 4 && parts.All(p => int.Parse(p, CultureInfo.InvariantCulture) <= 255)) return null;
            return s;
        }
        public static string Vendor(object value) { string code = VendorCode(value); return code == "other" ? L.T("Core.002") : code; }
        public static string VendorCode(object value)
        {
            string s = (Convert.ToString(value, CultureInfo.InvariantCulture) ?? "").ToUpperInvariant();
            if (s.Contains("NVIDIA")) return "NVIDIA";
            if (s.Contains("ADVANCED MICRO DEVICES") || Regex.IsMatch(s, @"\b(AMD|ATI)\b")) return "AMD";
            if (s.Contains("INTEL")) return "Intel";
            if (s.Contains("QUALCOMM")) return "Qualcomm";
            if (s.Contains("MICROSOFT")) return "Microsoft";
            return "other";
        }
        public static string LocalLabel(object value)
        {
            string s = Convert.ToString(value, CultureInfo.InvariantCulture) ?? "";
            return new string(s.Where(c => !char.IsControl(c)).Take(120).ToArray());
        }
        public static bool IsLocalExe(string path)
        {
            return path != null && path.Length <= 260 && Regex.IsMatch(path, @"\A[A-Za-z]:\\") &&
                !path.Substring(3).Contains(":") && !path.Contains("\0") &&
                path.EndsWith(".exe", StringComparison.OrdinalIgnoreCase);
        }
        public static string FileName(string path)
        {
            if (path == null) return "";
            string[] parts = path.Replace('/', '\\').Split('\\');
            return parts[parts.Length - 1];
        }
        private static string Canonical(string path)
        {
            return (path ?? "").Replace('/', '\\').Trim().Trim('"');
        }
        public static bool ValidWindow(DateTime start, DateTime end, DateTime now)
        {
            return start.Kind == DateTimeKind.Utc && end.Kind == DateTimeKind.Utc &&
                end > start && end - start <= TimeSpan.FromHours(MaxWindowHours) &&
                end <= now.AddSeconds(5) && start >= now.AddDays(-7);
        }
        public static ModuleKind ClassifyModule(string name)
        {
            // Only fixed classifications leave the parser, not arbitrary module names or paths.
            string n = FileName(name).ToLowerInvariant();
            if (new[] { "ntdll.dll", "kernelbase.dll", "kernel32.dll" }.Contains(n)) return ModuleKind.WindowsCore;
            if (new[] { "nvwgf2umx.dll", "nvwgf2um.dll", "nvldumdx.dll", "atidxx64.dll", "atidxx32.dll", "amdxx64.dll", "igd10iumd64.dll", "igd12umd64.dll", "dxgi.dll", "d3d11.dll", "d3d12.dll" }.Contains(n)) return ModuleKind.Graphics;
            if (new[] { "vcruntime140.dll", "vcruntime140_1.dll", "msvcp140.dll", "msvcr120.dll", "ucrtbase.dll" }.Contains(n)) return ModuleKind.VisualCpp;
            return string.IsNullOrEmpty(n) ? ModuleKind.Unknown : ModuleKind.Other;
        }
        public static ParseOutcome ParseEvent(string xml, string targetPath, DateTime start, DateTime end, out EventFact fact)
        {
            fact = null;
            if (string.IsNullOrEmpty(xml) || xml.Length > 65536) return ParseOutcome.Malformed;
            try
            {
                var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Prohibit, XmlResolver = null, MaxCharactersInDocument = 65536 };
                XDocument doc;
                using (var sr = new StringReader(xml))
                using (var reader = XmlReader.Create(sr, settings)) doc = XDocument.Load(reader, LoadOptions.None);
                XNamespace ns = "http://schemas.microsoft.com/win/2004/08/events/event";
                if (doc.Root == null || doc.Root.Name != ns + "Event") return ParseOutcome.Unsupported;
                var system = doc.Root.Element(ns + "System");
                if (system == null) return ParseOutcome.Unsupported;
                int id;
                if (!int.TryParse((string)system.Element(ns + "EventID"), out id)) return ParseOutcome.Unsupported;
                string provider = (string)system.Element(ns + "Provider")?.Attribute("Name");
                string channel = (string)system.Element(ns + "Channel");
                DateTime timestamp;
                if (!DateTime.TryParse((string)system.Element(ns + "TimeCreated")?.Attribute("SystemTime"), CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out timestamp)) return ParseOutcome.Unsupported;
                if (timestamp < start || timestamp > end) return ParseOutcome.NotTarget;
                EventKind kind;
                if (id == 1000 && provider == "Application Error" && channel == "Application") kind = EventKind.ApplicationCrash;
                else if (id == 1002 && provider == "Application Hang" && channel == "Application") kind = EventKind.ApplicationHang;
                else if (id == 4101 && provider == "Display" && channel == "System") kind = EventKind.DisplayRecovery;
                else if (id == 41 && provider == "Microsoft-Windows-Kernel-Power" && channel == "System") kind = EventKind.UncleanRestart;
                else return ParseOutcome.Unsupported;
                var data = new Dictionary<string, string>(StringComparer.Ordinal);
                var eventData = doc.Root.Element(ns + "EventData");
                if (eventData != null)
                {
                    foreach (var element in eventData.Elements(ns + "Data").Take(64))
                    {
                        string key = (string)element.Attribute("Name");
                        if (key != null && new[] { "AppName", "AppPath", "ExeFileName", "ModuleName", "ModulePath", "AppVersion", "ModuleVersion", "FaultingOffset", "ExceptionCode" }.Contains(key))
                        {
                            if (data.ContainsKey(key)) return ParseOutcome.Unsupported;
                            data.Add(key, element.Value);
                        }
                    }
                }
                var result = new EventFact { Kind = kind, TimeUtc = timestamp, Match = MatchKind.SystemContext };
                if (kind == EventKind.ApplicationCrash || kind == EventKind.ApplicationHang)
                {
                    string appPath, appName;
                    data.TryGetValue("AppPath", out appPath);
                    if (string.IsNullOrWhiteSpace(appPath)) data.TryGetValue("ExeFileName", out appPath);
                    data.TryGetValue("AppName", out appName);
                    if (!string.IsNullOrWhiteSpace(appPath))
                    {
                        if (!string.Equals(Canonical(appPath), Canonical(targetPath), StringComparison.OrdinalIgnoreCase)) return ParseOutcome.NotTarget;
                        result.Match = MatchKind.ExactPath;
                    }
                    else
                    {
                        if (string.IsNullOrWhiteSpace(appName)) return ParseOutcome.Unsupported;
                        if (!string.Equals(FileName(appName), FileName(targetPath), StringComparison.OrdinalIgnoreCase)) return ParseOutcome.NotTarget;
                        result.Match = MatchKind.NameOnly;
                    }
                    string module, code;
                    data.TryGetValue("ModuleName", out module);
                    string modulePath, appVersion, moduleVersion, faultOffset;
                    data.TryGetValue("ModulePath", out modulePath); data.TryGetValue("AppVersion", out appVersion);
                    data.TryGetValue("ModuleVersion", out moduleVersion); data.TryGetValue("FaultingOffset", out faultOffset);
                    CrashDetails.Attach(result, targetPath, module, modulePath, appVersion, moduleVersion, faultOffset);
                    data.TryGetValue("ExceptionCode", out code);
                    result.ExceptionCode = CrashDetails.Exception(code);
                }
                fact = result;
                return ParseOutcome.Accepted;
            }
            catch (XmlException) { return ParseOutcome.Malformed; }
            catch (ArgumentException) { return ParseOutcome.Malformed; }
        }
        public static List<Finding> Analyze(Snapshot scan)
        {
            var list = new List<Finding>();
            var app = scan.Application.Events;
            int crash = app.Count(x => x.Kind == EventKind.ApplicationCrash);
            int hang = app.Count(x => x.Kind == EventKind.ApplicationHang);
            if (scan.System.Events.Any(x => x.Kind == EventKind.UncleanRestart)) list.Add(new Finding {
                Evidence = L.T("Core.003"),
                Candidate = L.T("Core.004"),
                Unknown = L.T("Core.005"),
                StepId = "stop" });
            if (crash + hang > 0) list.Add(new Finding {
                Evidence = L.T("Core.006") + app.Count(x => x.Match == MatchKind.ExactPath) + L.T("Core.007") + app.Count(x => x.Match == MatchKind.NameOnly) + L.T("Core.008") + crash + L.T("Core.009") + hang + L.T("Core.010"),
                Candidate = L.T("Core.011"),
                Unknown = app.Any(x => x.Match == MatchKind.NameOnly) ? L.T("Core.012") : L.T("Core.013"),
                StepId = "files" });
            if (app.Any(x => x.Module == ModuleKind.Graphics) || scan.System.Events.Any(x => x.Kind == EventKind.DisplayRecovery)) list.Add(new Finding {
                Evidence = L.T("Core.014"),
                Candidate = L.T("Core.015"),
                Unknown = L.T("Core.016"),
                StepId = "graphics" });
            if (app.Any(x => x.Module == ModuleKind.VisualCpp)) list.Add(new Finding {
                Evidence = L.T("Core.017"),
                Candidate = L.T("Core.018"),
                Unknown = L.T("Core.019"),
                StepId = "runtime" });
            if (scan.Hardware.Disks.Any(x => x.FreeMiB.HasValue && x.TotalMiB > 0 && (x.FreeMiB < 5120 || (double)x.FreeMiB.Value / x.TotalMiB.Value < .05))) list.Add(new Finding {
                Evidence = L.T("Core.020"),
                Candidate = L.T("Core.021"),
                Unknown = L.T("Core.022"),
                StepId = "space" });
            if (scan.Hardware.FreeMemoryMiB.HasValue && scan.Hardware.FreeMemoryMiB < 1024) list.Add(new Finding {
                Evidence = L.T("Core.023"),
                Candidate = L.T("Core.024"),
                Unknown = L.T("Core.025"),
                StepId = "memory" });
            if (crash + hang == 0) list.Add(new Finding {
                Evidence = L.T("Core.026"),
                Candidate = L.T("Core.027"),
                Unknown = L.T("Core.028"),
                StepId = "observe" });
            return list;
        }
        public static GuideStep[] Steps { get { return new GuideStep[] {
            new GuideStep { Id="observe", Title=L.T("Core.029"), Instructions=L.T("Core.030"), Warning=L.T("Core.031"), GuideUrl="https://gemnao.pages.dev/guide/pc-game-crash", OfficialUrl="https://help.steampowered.com/ja/faqs/view/21F5-8D5D-0141-7A5E" },
            new GuideStep { Id="files", Title=L.T("Core.032"), Instructions=L.T("Core.033"), Warning=L.T("Core.034"), GuideUrl="https://gemnao.pages.dev/guide/verify-steam-files", OfficialUrl="https://help.steampowered.com/ja/faqs/view/0C48-FCBD-DA71-93EB" },
            new GuideStep { Id="graphics", Title=L.T("Core.035"), Instructions=L.T("Core.036"), Warning=L.T("Core.037"), GuideUrl="https://gemnao.pages.dev/guide/gpu-driver-update", OfficialUrl="https://support.microsoft.com/en-us/windows/hardware/display-graphics/troubleshooting-blank-screens-in-windows" },
            new GuideStep { Id="runtime", Title=L.T("Core.038"), Instructions=L.T("Core.039"), Warning=L.T("Core.040"), GuideUrl="https://gemnao.pages.dev/guide/visual-c-runtime-error", OfficialUrl="https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist" },
            new GuideStep { Id="space", Title=L.T("Core.041"), Instructions=L.T("Core.042"), Warning=L.T("Core.043"), GuideUrl="https://gemnao.pages.dev/guide/steam-disk-write-error", OfficialUrl="https://support.microsoft.com/en-us/windows/free-up-drive-space-in-windows-85529ccb-c365-490d-b548-831022bc9b32" },
            new GuideStep { Id="memory", Title=L.T("Core.044"), Instructions=L.T("Core.045"), Warning=L.T("Core.046"), GuideUrl="https://gemnao.pages.dev/guide/pc-game-crash", OfficialUrl="https://support.microsoft.com/ja-jp/windows/experience/system-configuration-tools-in-windows" },
            new GuideStep { Id="stop", Title=L.T("Core.047"), Instructions=L.T("Core.048"), Warning=L.T("Core.049"), GuideUrl="https://gemnao.pages.dev/guide/pc-game-crash", OfficialUrl="https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart" }
        }; } }
        public static string StatusText(ReadStatus status)
        {
            switch (status) { case ReadStatus.Complete: return L.T("Core.050"); case ReadStatus.AccessDenied: return L.T("Core.051"); case ReadStatus.Unavailable: return L.T("Core.052"); case ReadStatus.TimedOut: return L.T("Core.053"); case ReadStatus.Partial: return L.T("Core.054"); case ReadStatus.Cancelled: return L.T("Core.055"); default: return L.T("Core.056"); }
        }
        public static string Compare(Snapshot before, Snapshot after, TrialOutcome result)
        {
            if (before == null || after == null) return L.T("Core.057");
            if (before.Game != after.Game || before.Symptom != after.Symptom) return L.T("Core.058");
            if (before.TargetSession == Guid.Empty || before.TargetSession != after.TargetSession) return L.T("Core.059");
            if (before.AttemptId != Guid.Empty && before.AttemptId == after.AttemptId) return L.T("Core.060");
            if (after.StartUtc <= before.EndUtc) return L.T("Core.061");
            string outcome = new[] { L.T("Core.062"), L.T("Core.063"), L.T("Core.064"), L.T("Core.065"), L.T("Core.066") }[(int)result];
            bool complete = before.Application.Status == ReadStatus.Complete && after.Application.Status == ReadStatus.Complete && !before.Application.LimitReached && !after.Application.LimitReached;
            double a = (before.EndUtc - before.StartUtc).TotalMinutes, b = (after.EndUtc - after.StartUtc).TotalMinutes;
            var text = new StringBuilder();
            text.AppendLine(L.T("Core.067") + outcome);
            text.AppendLine(L.T("Core.068"));
            text.AppendLine(L.T("Core.069") + before.Application.Events.Count + L.T("Core.070") + a.ToString("0.0", CultureInfo.InvariantCulture) + L.T("Core.071") + after.Application.Events.Count + L.T("Core.070") + b.ToString("0.0", CultureInfo.InvariantCulture) + L.T("Core.072"));
            if (!complete) text.AppendLine(L.T("Core.073"));
            if (Math.Abs(a - b) > .1) text.AppendLine(L.T("Core.074"));
            text.AppendLine(L.T("Core.075"));
            return text.ToString();
        }
        public static string BuildReport(Snapshot current, Snapshot baseline, TrialOutcome outcome, IDictionary<string, StepState> states, bool includeActions = true, bool includeKnownModuleNames = false)
        {
            // Explicit, closed projection: never reflect/serialize collector objects or arbitrary strings.
            var b = new StringBuilder();
            b.AppendLine(L.T("Core.076") + Version + L.T("Core.077"));
            b.AppendLine(L.T("Core.078"));
            b.AppendLine(L.T("Core.079"));
            b.AppendLine(L.T("Core.080"));
            if (baseline != null && baseline != current) { AppendSnapshot(b, baseline, L.T("Core.081"), includeKnownModuleNames); b.AppendLine(); }
            AppendSnapshot(b, current, baseline == null || baseline == current ? L.T("Core.082") : L.T("Core.083"), includeKnownModuleNames);
            if (baseline != null && baseline != current) { b.AppendLine(L.T("Core.084")); b.AppendLine(Compare(baseline, current, outcome)); }
            b.AppendLine(CrashDetails.PatternReport(current, baseline, includeKnownModuleNames));
            if (includeActions)
            {
            b.AppendLine(L.T("Core.085"));
            foreach (var step in Steps)
            {
                StepState state;
                if (states == null || !states.TryGetValue(step.Id, out state)) state = StepState.NotStarted;
                b.AppendLine(step.Title + ": " + StateText(state));
            }
            b.AppendLine(L.T("Core.086"));
            foreach (var id in Analyze(current).Select(x => x.StepId).Distinct())
            {
                var step = Steps.First(x => x.Id == id);
                b.AppendLine(step.Title + "\n" + step.Instructions + L.T("Core.087") + step.Warning + L.T("Core.088") + L.LinkLabel(step.GuideUrl) + L.T("Core.089") + step.OfficialUrl + "\n");
            }
            }
            b.AppendLine(L.T("Core.090"));
            return b.ToString();
        }
        public static string StateText(StepState state)
        {
            switch (state) { case StepState.Checked: return L.T("Core.091"); case StepState.Tried: return L.T("Core.092"); case StepState.Skipped: return L.T("Core.093"); default: return L.T("Core.094"); }
        }
        private static void AppendSnapshot(StringBuilder b, Snapshot s, string title, bool includeKnownModuleNames)
        {
            if (s == null) return;
            b.AppendLine("【" + title + L.T("Core.095"));
            b.AppendLine(CaptureWorkflow.Description(s));
            if (s.PriorRestartObserved) b.AppendLine(L.T("Core.096"));
            b.AppendLine(L.T("Core.097") + (s.EndUtc - s.StartUtc).TotalMinutes.ToString("0.0", CultureInfo.InvariantCulture) + L.T("Core.098"));
            var h = s.Hardware;
            b.AppendLine(L.T("Core.099") + NumericVersion(h.OsVersion) + " / " + StatusText(h.OsStatus));
            b.AppendLine(L.T("Core.100") + Vendor(h.CpuVendor) + L.T("Core.101") + Number(h.LogicalProcessors) + " / " + StatusText(h.CpuStatus));
            b.AppendLine(L.T("Core.102") + Number(h.TotalMemoryMiB) + L.T("Core.103") + Number(h.FreeMemoryMiB) + L.T("Core.104"));
            b.AppendLine("GPU: " + StatusText(h.GpuStatus));
            foreach (var gpu in h.Gpus.Take(8)) b.AppendLine(L.T("Core.105") + Vendor(gpu.Vendor) + L.T("Core.106") + NumericVersion(gpu.DriverVersion));
            b.AppendLine(L.T("Core.107") + StatusText(h.DiskStatus));
            foreach (var disk in h.Disks.Take(2)) b.AppendLine("  " + (disk.IsSystem ? L.T("Core.108") : L.T("Core.109")) + L.T("Core.110") + Number(disk.FreeMiB) + L.T("Core.111") + Number(disk.TotalMiB) + " MiB");
            AppendLog(b, s.Application, "Application", s.EndUtc, includeKnownModuleNames);
            AppendLog(b, s.System, L.T("Core.112"), s.EndUtc, includeKnownModuleNames);
            b.AppendLine(L.T("Core.113"));
            foreach (var f in Analyze(s)) b.AppendLine(L.T("Core.114") + f.Evidence + L.T("Core.115") + f.Candidate + L.T("Core.116") + f.Unknown + "\n");
        }
        private static string Number(long? n) { return n.HasValue && n >= 0 ? n.Value.ToString(CultureInfo.InvariantCulture) : L.T("Core.001"); }
        private static void AppendLog(StringBuilder b, LogFacts log, string label, DateTime end, bool knownNames)
        {
            b.AppendLine(label + ": " + StatusText(log.Status) + L.T("Core.117") + log.Examined + L.T("Core.118") + log.Unsupported + L.T("Core.119") + (log.LimitReached ? L.T("Core.120") : L.T("Core.121")));
            foreach (var e in log.Events.Take(MaxEventsPerLog))
            {
                string kind = e.Kind == EventKind.ApplicationCrash ? "Application Error 1000" : e.Kind == EventKind.ApplicationHang ? "Application Hang 1002" : e.Kind == EventKind.DisplayRecovery ? "Display 4101" : "Kernel-Power 41";
                string match = e.Match == MatchKind.ExactPath ? L.T("Core.122") : e.Match == MatchKind.NameOnly ? L.T("Core.123") : L.T("Core.124");
                string module = CrashDetails.ModuleText(e, knownNames);
                string code = Regex.IsMatch(e.ExceptionCode ?? "", @"\A[A-F0-9]{8}\z") ? e.ExceptionCode : L.T("Core.001");
                b.AppendLine(L.T("Core.125") + Math.Max(0, (end - e.TimeUtc).TotalMinutes).ToString("0.0", CultureInfo.InvariantCulture) + L.T("Core.126") + kind + " / " + match + L.T("Core.127") + module + L.T("Core.128") + code);
                if (e.Kind == EventKind.ApplicationCrash) b.AppendLine(L.T("Core.129") + CrashDetails.VersionText(e.AppVersionParts) + L.T("Core.130") + CrashDetails.VersionText(e.ModuleVersionParts) + L.T("Core.131") + CrashDetails.OffsetText(e.FaultOffset));
            }
        }
    }
}
