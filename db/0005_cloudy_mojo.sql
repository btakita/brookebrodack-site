CREATE TABLE `person` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email_verified` integer,
	`image` text
);
--> statement-breakpoint
DROP TABLE IF EXISTS `account`;--> statement-breakpoint
DROP TABLE IF EXISTS `user`;--> statement-breakpoint
DROP TABLE IF EXISTS `verificationToken`;--> statement-breakpoint
DROP TABLE IF EXISTS `session`;--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`expire_dts` integer NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE no action
);
