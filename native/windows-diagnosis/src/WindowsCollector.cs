using System;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Globalization;
using System.IO;
using System.Management;
using System.Security;
using System.Threading;

namespace Gemnao.Diagnostics
{
    internal static class WindowsCollector
    {
        internal static Snapshot Collect(string targetPath, Guid targetSession, DateTime startUtc, DateTime endUtc, CancellationToken cancel, string steamExe = null, bool readTraces = false, bool readArchive = false, bool readSteam = false, GameKind gameKind = GameKind.General, GameSymptom symptom = GameSymptom.Launch)
        {
            if (!GameProfile.Accepts(targetPath,gameKind) || !Enum.IsDefined(typeof(GameSymptom),symptom) || !Rules.ValidWindow(startUtc, endUtc, DateTime.UtcNow)) throw new ArgumentException("Invalid local selection or time window.");
            var s = new Snapshot { Game=gameKind, Symptom=symptom, TargetSession = targetSession, StartUtc = startUtc, EndUtc = endUtc, CollectedUtc = DateTime.UtcNow };
            long installed = 0; bool anyInstalled = false, invalidInstalled = false;
            s.Wilds.InstalledRamStatus = Query("SELECT Capacity FROM Win32_PhysicalMemory", 16, cancel, o => {
                long? size = Nonnegative(o["Capacity"], 1048576);
                if (size.HasValue && size.Value > 0 && size.Value < 16777216) { installed += size.Value; anyInstalled = true; } else invalidInstalled = true;
            });
            if (invalidInstalled && s.Wilds.InstalledRamStatus == ReadStatus.Complete) s.Wilds.InstalledRamStatus = ReadStatus.Partial;
            if (anyInstalled && !invalidInstalled && s.Wilds.InstalledRamStatus == ReadStatus.Complete) s.Wilds.InstalledRamMiB = installed;
            s.Hardware.OsStatus = Query("SELECT Version,TotalVisibleMemorySize,FreePhysicalMemory FROM Win32_OperatingSystem", 1, cancel, o => {
                s.Hardware.OsVersion = Rules.NumericVersionValue(o["Version"]);
                s.Hardware.TotalMemoryMiB = Nonnegative(o["TotalVisibleMemorySize"], 1024);
                s.Hardware.FreeMemoryMiB = Nonnegative(o["FreePhysicalMemory"], 1024);
            });
            s.Hardware.CpuStatus = Query("SELECT Name,Manufacturer,NumberOfLogicalProcessors FROM Win32_Processor", 1, cancel, o => {
                s.Hardware.LocalCpuName = Rules.LocalLabel(o["Name"]);
                s.Hardware.CpuVendor = Rules.VendorCode(o["Manufacturer"]);
                long? n = Nonnegative(o["NumberOfLogicalProcessors"], 1);
                s.Hardware.LogicalProcessors = n.HasValue && n.Value <= 4096 ? (int?)n.Value : null;
            });
            s.Hardware.GpuStatus = Query("SELECT Name,AdapterCompatibility,DriverVersion FROM Win32_VideoController", 8, cancel, o => {
                s.Hardware.LocalGpuNames.Add(Rules.LocalLabel(o["Name"]));
                s.Hardware.Gpus.Add(new GpuFact { Vendor = Rules.VendorCode(o["AdapterCompatibility"]), DriverVersion = Rules.NumericVersionValue(o["DriverVersion"]) });
            });
            // Only volumes for Windows and the chosen EXE, no volume labels, IDs, serials, or inventory.
            s.Hardware.DiskStatus = ReadStatus.Complete;
            CollectDisk(s, Path.GetPathRoot(Environment.SystemDirectory), true, cancel);
            CollectDisk(s, Path.GetPathRoot(targetPath), false, cancel);
            ReadEvents(s.Application, "Application", "((EventID=1000 and Provider[@Name='Application Error']) or (EventID=1002 and Provider[@Name='Application Hang']))", targetPath, startUtc, endUtc, cancel);
            ReadEvents(s.System, "System", "((EventID=4101 and Provider[@Name='Display']) or (EventID=41 and Provider[@Name='Microsoft-Windows-Kernel-Power']))", targetPath, startUtc, endUtc, cancel);
            WildsLocal.Collect(s, targetPath, steamExe, cancel, readTraces, readArchive,readSteam,gameKind==GameKind.Wilds);
            if(readSteam)SteamLocal.Read(s.Steam,steamExe,cancel);
            return s;
        }
        private static void CollectDisk(Snapshot s, string root, bool isSystem, CancellationToken cancel)
        {
            var disk = new DiskFact { IsSystem = isSystem };
            s.Hardware.Disks.Add(disk);
            if (cancel.IsCancellationRequested) { s.Hardware.DiskStatus = ReadStatus.Cancelled; return; }
            if (string.IsNullOrEmpty(root) || root.Length != 3 || root[1] != ':') { s.Hardware.DiskStatus = ReadStatus.Partial; return; }
            // Mount-point/subst mapping is not inferred; UI/docs explicitly limit this to drive-root volumes.
            string drive = char.ToUpperInvariant(root[0]) + ":";
            var status = Query("SELECT FreeSpace,Size FROM Win32_LogicalDisk WHERE DeviceID='" + drive + "' AND DriveType=3", 1, cancel, o => {
                disk.FreeMiB = Nonnegative(o["FreeSpace"], 1048576);
                disk.TotalMiB = Nonnegative(o["Size"], 1048576);
            });
            if (status != ReadStatus.Complete) s.Hardware.DiskStatus = status;
        }
        private static long? Nonnegative(object value, long divisor)
        {
            ulong n;
            if (value == null || !ulong.TryParse(Convert.ToString(value, CultureInfo.InvariantCulture), out n) || n / (ulong)divisor > long.MaxValue) return null;
            return (long)(n / (ulong)divisor);
        }
        private static ReadStatus Query(string query, int limit, CancellationToken cancel, Action<ManagementBaseObject> consume)
        {
            if (cancel.IsCancellationRequested) return ReadStatus.Cancelled;
            try
            {
                var options = new EnumerationOptions { ReturnImmediately = false, Rewindable = false, Timeout = TimeSpan.FromSeconds(5), BlockSize = 1 };
                // Local-only namespace, no credentials, no remote computer, no privilege enabling.
                using (var searcher = new ManagementObjectSearcher(new ManagementScope(@"root\cimv2"), new ObjectQuery(query), options))
                using (var rows = searcher.Get())
                {
                    int count = 0;
                    foreach (ManagementBaseObject row in rows)
                    {
                        using (row)
                        {
                            if (cancel.IsCancellationRequested) return ReadStatus.Cancelled;
                            if (count >= limit) return ReadStatus.Partial;
                            consume(row); count++;
                        }
                    }
                    return count == 0 ? ReadStatus.Unavailable : ReadStatus.Complete;
                }
            }
            catch (UnauthorizedAccessException) { return ReadStatus.AccessDenied; }
            catch (SecurityException) { return ReadStatus.AccessDenied; }
            catch (ManagementException ex) { return ex.ErrorCode == ManagementStatus.AccessDenied ? ReadStatus.AccessDenied : ex.ErrorCode == ManagementStatus.Timedout ? ReadStatus.TimedOut : ReadStatus.Unavailable; }
            catch (Exception) { return ReadStatus.Unavailable; } // No raw exception text: can contain paths/user data.
        }
        private static void ReadEvents(LogFacts target, string channel, string selector, string targetPath, DateTime start, DateTime end, CancellationToken cancel)
        {
            if (cancel.IsCancellationRequested) { target.Status = ReadStatus.Cancelled; return; }
            string range = "TimeCreated[@SystemTime >= '" + start.ToString("o", CultureInfo.InvariantCulture) + "' and @SystemTime <= '" + end.ToString("o", CultureInfo.InvariantCulture) + "']";
            // Selector is an internal constant; target path and log content never enter executable queries.
            var query = new EventLogQuery(channel, PathType.LogName, "*[System[" + selector + " and " + range + "]]") { ReverseDirection = true, TolerateQueryErrors = false };
            var watch = Stopwatch.StartNew();
            try
            {
                using (var reader = new EventLogReader(query))
                {
                    reader.BatchSize = 16;
                    for (;;)
                    {
                        if (cancel.IsCancellationRequested) { target.Status = ReadStatus.Cancelled; return; }
                        if (watch.Elapsed > TimeSpan.FromSeconds(15)) { target.Status = ReadStatus.TimedOut; return; }
                        using (var record = reader.ReadEvent(TimeSpan.FromSeconds(3)))
                        {
                            if (record == null) { target.Status = target.Unsupported == 0 ? ReadStatus.Complete : ReadStatus.Partial; return; }
                            if (target.Examined >= Rules.MaxEventsPerLog) { target.LimitReached = true; target.Status = ReadStatus.Partial; return; }
                            target.Examined++;
                            EventFact fact;
                            bool otherTarget;
                            var outcome = Rules.ParseEvent(record.ToXml(), targetPath, start, end, out fact, out otherTarget);
                            if (otherTarget) target.OtherTarget++;
                            if (outcome == ParseOutcome.Accepted) target.Events.Add(fact);
                            else if (outcome == ParseOutcome.Malformed || outcome == ParseOutcome.Unsupported) target.Unsupported++;
                        }
                    }
                }
            }
            catch (UnauthorizedAccessException) { target.Status = ReadStatus.AccessDenied; }
            catch (SecurityException) { target.Status = ReadStatus.AccessDenied; }
            catch (TimeoutException) { target.Status = ReadStatus.TimedOut; }
            catch (EventLogException) { target.Status = ReadStatus.Unavailable; }
            catch (Exception) { target.Status = ReadStatus.Unavailable; }
        }
    }
}
