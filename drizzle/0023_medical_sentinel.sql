CREATE UNIQUE INDEX IF NOT EXISTS "comment_id_idx" ON "comments" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_id_idx" ON "posts" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "users" ("id");