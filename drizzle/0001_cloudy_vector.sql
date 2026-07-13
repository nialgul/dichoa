CREATE TABLE `discord_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`discord_id` varchar(64) NOT NULL,
	`discord_username` varchar(255),
	`discord_avatar` text,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`token_expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discord_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `discord_users_discord_id_unique` UNIQUE(`discord_id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`server_id` varchar(64) NOT NULL,
	`user_id` int,
	`discord_user_id` varchar(64),
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`email` varchar(320),
	`status` enum('open','closed') NOT NULL DEFAULT 'open',
	`closed_at` timestamp,
	`closed_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `server_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`server_id` varchar(64) NOT NULL,
	`server_name` varchar(255),
	`server_icon` text,
	`webhook_url` text,
	`inquiry_channel_id` varchar(64),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `server_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `server_settings_server_id_unique` UNIQUE(`server_id`)
);
--> statement-breakpoint
CREATE TABLE `webhook_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`server_id` varchar(64) NOT NULL,
	`webhook_url` text NOT NULL,
	`notify_on_inquiry` boolean NOT NULL DEFAULT true,
	`notify_on_close` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhook_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `webhook_settings_server_id_unique` UNIQUE(`server_id`)
);
