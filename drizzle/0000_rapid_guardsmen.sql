CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" date DEFAULT now(),
	"upvotes" integer DEFAULT 0
);
