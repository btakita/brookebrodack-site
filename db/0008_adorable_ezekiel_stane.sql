DROP TABLE IF EXISTS `youtube_video`;
CREATE TABLE `youtube_video` (
	`videoId`      text PRIMARY KEY NOT NULL,
	`create_ms`    integer          NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`published_ms` integer          NOT NULL,
	`updated_ms`   integer          NOT NULL,
	`channelId`    text             NOT NULL,
	`author_name`  text             NOT NULL,
	`author_uri`   text             NOT NULL,
	`title`        text             NOT NULL,
	`thumbnail`    text             NOT NULL,
	`description`  text);
