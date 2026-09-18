CREATE TABLE `discord_server_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`server_name` text NOT NULL,
	`description` text NOT NULL,
	`invite_url` text NOT NULL,
	`game` text NOT NULL,
	`purpose` text NOT NULL,
	`play_style` text DEFAULT '[]' NOT NULL,
	`activity_time` text NOT NULL,
	`voice_chat` text NOT NULL,
	`requirements` text NOT NULL,
	`rules` text NOT NULL,
	`owner_discord` text NOT NULL,
	`reply_email` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`invite_status` text DEFAULT 'unchecked' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`reviewed_at` text,
	`last_verified_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discord_server_submissions_slug_unique` ON `discord_server_submissions` (`slug`);