DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "comment_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "post_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "community_name_idx" ON "communities" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_name_idx" ON "users" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_to_comment_user_id_idx" ON "users_to_comments" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_to_comment_comment_id_idx" ON "users_to_comments" ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_to_community_user_id_idx" ON "users_to_communities" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_to_post_user_id_idx" ON "users_to_posts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_to_post_post_id_idx" ON "users_to_posts" ("post_id");