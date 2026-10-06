-- Read-only metadata. No respondent records, counts, contact data, or secrets.
PRAGMA table_info(issue_feedback);
PRAGMA table_info(solution_method_feedback);
PRAGMA table_info(step_result_receipts);
PRAGMA index_list(step_result_receipts);
SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('issue_feedback', 'solution_method_feedback', 'step_result_receipts', 'd1_migrations');
SELECT name, sql FROM sqlite_master WHERE name IN ('issue_feedback', 'solution_method_feedback', 'step_result_receipts', 'step_result_receipts_requested_at');
