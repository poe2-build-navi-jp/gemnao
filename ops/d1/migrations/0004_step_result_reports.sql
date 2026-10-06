CREATE TABLE `step_result_receipts` (
	`request_id` text PRIMARY KEY NOT NULL,
	`requested_at` text NOT NULL,
	`context_slug` text NOT NULL,
	`topic` text NOT NULL,
	`method_id` text NOT NULL,
	`outcome` text NOT NULL,
	`report_struggling` integer NOT NULL,
	CONSTRAINT "step_result_receipts_outcome" CHECK("step_result_receipts"."outcome" IN ('resolved', 'not-resolved')),
	CONSTRAINT "step_result_receipts_struggling" CHECK("step_result_receipts"."report_struggling" IN (0, 1))
);
--> statement-breakpoint
CREATE INDEX `step_result_receipts_requested_at` ON `step_result_receipts` (`requested_at`);--> statement-breakpoint
ALTER TABLE `solution_method_feedback` ADD `not_resolved_count` integer DEFAULT 0 NOT NULL;