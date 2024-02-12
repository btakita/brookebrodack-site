DROP TABLE IF EXISTS `text_cache`;
CREATE TABLE `text_cache` (
	`text_cache_id` text PRIMARY KEY NOT NULL,
	`create_ms`     integer          NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`validate_ms`   integer          NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`data`          text             NOT NULL);
