ALTER TABLE `admin_credentials` ADD `must_change` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_credentials` ADD `temporary` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_sessions` ADD `username` text DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE `guests` ADD `honorific` text DEFAULT '' NOT NULL;