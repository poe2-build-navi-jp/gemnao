// Prepared only. No deployed cron/config/binding is added by this change.
import cleanup from './diagnostic-feedback-cleanup';
const privateCleanup = {
  scheduled(
    event: ScheduledEvent,
    env: { PRIVATE_DIAGNOSTIC_DB?: D1Database },
  ) {
    return cleanup.scheduled(event, { FEEDBACK_DB: env.PRIVATE_DIAGNOSTIC_DB });
  },
  fetch() {
    return cleanup.fetch();
  },
};

export default privateCleanup;
