CREATE TABLE `cart_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`menu_item_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `catalog_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`queue_id` integer NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text,
	`deleted_at` text,
	`content_hash` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_categories_queue_id_unique` ON `catalog_categories` (`queue_id`);--> statement-breakpoint
CREATE TABLE `catalog_menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`queue_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`meal_price` integer,
	`available` integer DEFAULT true NOT NULL,
	`image` text,
	`has_flavor_options` integer DEFAULT false,
	`has_meal_option` integer DEFAULT false,
	`is_spicy_option` integer DEFAULT false,
	`updated_at` text,
	`deleted_at` text,
	`content_hash` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_menu_items_queue_id_unique` ON `catalog_menu_items` (`queue_id`);--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`category` text DEFAULT 'food',
	`is_active` integer DEFAULT 1,
	`created_at` text DEFAULT 'datetime(''now'')'
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price` text NOT NULL,
	`description` text,
	`image` text,
	`spice_level` integer DEFAULT 0,
	`is_available` integer DEFAULT 1,
	`created_at` text DEFAULT 'datetime(''now'')'
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`customer_email` text,
	`order_items` text NOT NULL,
	`total_amount` text NOT NULL,
	`status` text DEFAULT 'pending',
	`order_type` text NOT NULL,
	`delivery_address` text,
	`delivery_fee` text DEFAULT '0',
	`notes` text,
	`created_at` text DEFAULT 'datetime(''now'')'
);
--> statement-breakpoint
CREATE TABLE `sync_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`status` text NOT NULL,
	`item_count` integer DEFAULT 0,
	`error_message` text,
	`created_at` text DEFAULT 'datetime(''now'')'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);