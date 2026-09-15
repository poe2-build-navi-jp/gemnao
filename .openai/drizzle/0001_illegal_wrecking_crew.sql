CREATE TABLE `solution_method_feedback` (
	`context_slug` text NOT NULL,
	`topic` text NOT NULL,
	`method_id` text NOT NULL,
	`method_label` text NOT NULL,
	`response_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`context_slug`, `topic`, `method_id`)
);
