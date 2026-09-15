CREATE TABLE `issue_feedback` (
	`game_slug` text NOT NULL,
	`topic` text NOT NULL,
	`struggling_count` integer DEFAULT 0 NOT NULL,
	`resolved_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`game_slug`, `topic`)
);
