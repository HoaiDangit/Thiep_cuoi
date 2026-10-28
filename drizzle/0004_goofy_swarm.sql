CREATE TABLE `admin_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`salt` text NOT NULL,
	`password_hash` text NOT NULL,
	`iterations` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_setup_tokens` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL
);
