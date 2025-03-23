CREATE INDEX `episode_series_id_idx` ON `episode` (`seriesId`);--> statement-breakpoint
CREATE INDEX `episode_stream_id_idx` ON `episode` (`streamId`);--> statement-breakpoint
CREATE INDEX `episode_order_idx` ON `episode` (`order`);--> statement-breakpoint
CREATE INDEX `program_start_at_idx` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `program_end_at_idx` ON `program` (`endAt`);--> statement-breakpoint
CREATE INDEX `program_channel_id_idx` ON `program` (`channelId`);--> statement-breakpoint
CREATE INDEX `program_episode_id_idx` ON `program` (`episodeId`);--> statement-breakpoint
CREATE INDEX `rec_item_module_id_idx` ON `recommendedItem` (`moduleId`);--> statement-breakpoint
CREATE INDEX `rec_item_series_id_idx` ON `recommendedItem` (`seriesId`);--> statement-breakpoint
CREATE INDEX `rec_item_episode_id_idx` ON `recommendedItem` (`episodeId`);--> statement-breakpoint
CREATE INDEX `rec_item_order_idx` ON `recommendedItem` (`order`);--> statement-breakpoint
CREATE INDEX `rec_module_reference_id_idx` ON `recommendedModule` (`referenceId`);--> statement-breakpoint
CREATE INDEX `rec_module_order_idx` ON `recommendedModule` (`order`);--> statement-breakpoint
CREATE INDEX `series_id_idx` ON `series` (`id`);--> statement-breakpoint
CREATE INDEX `stream_id_idx` ON `stream` (`id`);