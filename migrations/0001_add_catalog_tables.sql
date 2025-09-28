-- Create catalog replica tables for sync from queue system
CREATE TABLE IF NOT EXISTS `catalog_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`queue_id` integer NOT NULL UNIQUE,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`content_hash` text
);

CREATE TABLE IF NOT EXISTS `catalog_menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`queue_id` integer NOT NULL UNIQUE,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`meal_price` integer,
	`available` integer DEFAULT 1 NOT NULL,
	`image` text,
	`has_flavor_options` integer DEFAULT 0,
	`has_meal_option` integer DEFAULT 0,
	`is_spicy_option` integer DEFAULT 0,
	`updated_at` text,
	`deleted_at` text,
	`content_hash` text,
	FOREIGN KEY (`category_id`) REFERENCES `catalog_categories` (`id`)
);

CREATE TABLE IF NOT EXISTS `sync_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`status` text NOT NULL,
	`item_count` integer DEFAULT 0,
	`error_message` text,
	`created_at` text DEFAULT (datetime('now'))
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS `catalog_categories_queue_id_unique` ON `catalog_categories` (`queue_id`);
CREATE UNIQUE INDEX IF NOT EXISTS `catalog_menu_items_queue_id_unique` ON `catalog_menu_items` (`queue_id`);
CREATE INDEX IF NOT EXISTS `catalog_menu_items_category_available` ON `catalog_menu_items` (`category_id`, `available`);
CREATE INDEX IF NOT EXISTS `catalog_categories_display_order` ON `catalog_categories` (`display_order`);
CREATE INDEX IF NOT EXISTS `sync_events_created_at` ON `sync_events` (`created_at`);