ALTER TABLE `text_cache` RENAME COLUMN `create_ms` TO `create_dts`;--> statement-breakpoint
ALTER TABLE `text_cache` RENAME COLUMN `validate_ms` TO `validate_dts`;--> statement-breakpoint
ALTER TABLE `account` RENAME COLUMN `expires_at` TO `expire_dts`;--> statement-breakpoint
ALTER TABLE `session` RENAME COLUMN `expires` TO `expire_dts`;--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN `email_verified` TO `email_verify_dts`;--> statement-breakpoint
ALTER TABLE `verification_token` RENAME COLUMN `expires` TO `expire_dts`;--> statement-breakpoint
ALTER TABLE `youtube_video` RENAME COLUMN `create_ms` TO `create_dts`;--> statement-breakpoint
ALTER TABLE `youtube_video` RENAME COLUMN `published_ms` TO `publishedAt`;--> statement-breakpoint
ALTER TABLE `youtube_video` RENAME COLUMN `updated_ms` TO `updatedAt`;