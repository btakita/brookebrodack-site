ALTER TABLE `youtube_video` RENAME COLUMN `author_name` TO `channelTitle`;--> statement-breakpoint
ALTER TABLE youtube_video ADD `etag` text;--> statement-breakpoint
ALTER TABLE youtube_video ADD `playlistItemListResponse_etag` text;--> statement-breakpoint
CREATE INDEX `playlistItemListResponse_etag_idx` ON `youtube_video` (`playlistItemListResponse_etag`);--> statement-breakpoint
ALTER TABLE `youtube_video` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `youtube_video` DROP COLUMN `author_uri`;--> statement-breakpoint
ALTER TABLE `youtube_video` DROP COLUMN `thumbnail`;