using System;
using System.Linq;

namespace Gemnao.Diagnostics
{
    public enum CaptureMode { InitialAttempt, InitialRecent, Retest, Refresh }
    public enum CaptureOrigin { Unknown, TimedAttempt, RecentWindow }

    // Create the whole transition before the UI replaces accepted results. No I/O or polling.
    public sealed class CaptureTransition
    {
        public Snapshot Current;
        public Snapshot Baseline;
        public TrialOutcome Outcome;
        public bool PreserveStepRecords;
    }

    public static class CaptureWorkflow
    {
        public const int MaxRefreshMinutes = 30;
        public static string RefreshButtonText { get { return L.T("CaptureWorkflow.001"); } }
        public static string FinishButtonText { get { return L.T("CaptureWorkflow.002"); } }
        public static string MissingRecordHint { get { return L.T("CaptureWorkflow.003"); } }

        public static bool CanRefresh(Snapshot previous, DateTime now)
        {
            return previous != null && now.Kind == DateTimeKind.Utc && now >= previous.EndUtc &&
                Rules.ValidWindow(previous.StartUtc, now, now) &&
                now - previous.StartUtc <= TimeSpan.FromMinutes(MaxRefreshMinutes);
        }

        public static bool TryCommit(Snapshot captured, Snapshot previous, Snapshot baseline,
            Guid expectedTarget, bool cancelled, CaptureMode mode, TrialOutcome outcome,
            out CaptureTransition transition)
        {
            transition = null;
            if (!WildsProfile.AcceptsCapture(captured, expectedTarget, cancelled) ||
                !Rules.ValidWindow(captured.StartUtc, captured.EndUtc, captured.EndUtc)) return false;
            if (previous != null && (previous.TargetSession != expectedTarget || previous.Game != captured.Game || previous.Symptom != captured.Symptom)) return false;
            if (mode == CaptureMode.Refresh)
            {
                if (!CanRefresh(previous, captured.EndUtc) || captured.StartUtc != previous.StartUtc ||
                    previous.AttemptId == Guid.Empty) return false;
            }
            else if (mode == CaptureMode.Retest)
            {
                if (previous == null || captured.StartUtc <= previous.EndUtc) return false;
            }
            else if ((mode != CaptureMode.InitialAttempt && mode != CaptureMode.InitialRecent) || previous != null) return false;

            bool refresh = mode == CaptureMode.Refresh;
            captured.AttemptId = refresh ? previous.AttemptId : Guid.NewGuid();
            captured.Origin = refresh ? previous.Origin : mode == CaptureMode.InitialRecent ? CaptureOrigin.RecentWindow : CaptureOrigin.TimedAttempt;
            captured.RefreshCount = refresh ? Math.Min(999, previous.RefreshCount + 1) : 0;
            // A later partial read must not remove a safety stop already observed in this session.
            captured.PriorRestartObserved |= previous != null && (previous.PriorRestartObserved ||
                previous.System.Events.Any(e => e.Kind == EventKind.UncleanRestart));
            transition = new CaptureTransition
            {
                Current = captured,
                Baseline = refresh ? baseline : mode == CaptureMode.Retest ? previous : null,
                Outcome = refresh ? outcome : TrialOutcome.NotTested,
                PreserveStepRecords = refresh || mode == CaptureMode.Retest
            };
            return true;
        }

        public static string Description(Snapshot s)
        {
            string origin = s.Origin == CaptureOrigin.TimedAttempt ? L.T("CaptureWorkflow.004") :
                s.Origin == CaptureOrigin.RecentWindow ? L.T("CaptureWorkflow.005") : L.T("CaptureWorkflow.006");
            return L.T("CaptureWorkflow.007") + origin + (s.RefreshCount > 0 ? L.T("CaptureWorkflow.008") + Math.Min(999, s.RefreshCount) + L.T("CaptureWorkflow.009") : "");
        }
    }
}
