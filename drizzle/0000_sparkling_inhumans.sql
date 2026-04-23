CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`major` text NOT NULL,
	`year` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);

-- old student file I didnt change it switched to job applications instead