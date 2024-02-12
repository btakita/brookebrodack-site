CREATE TABLE IF NOT EXISTS `text_cache` (
	`text_cache_id` text PRIMARY KEY NOT NULL,
	`create_ms` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`validate_ms` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `account` (
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `provider_account_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `session` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`email_verified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `verification_token` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `youtube_video` (
	`videoId` text PRIMARY KEY NOT NULL,
	`create_ms` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_ms` integer NOT NULL,
	`updated_ms` integer NOT NULL,
	`channelId` text NOT NULL,
	`author_name` text NOT NULL,
	`author_uri` text NOT NULL,
	`title` text NOT NULL,
	`thumbnail` text NOT NULL,
	`description` text
);
