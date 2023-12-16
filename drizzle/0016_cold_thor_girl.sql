DO $$ BEGIN
 CREATE TYPE "vote_status" AS ENUM('upvoted', 'downvoted', 'none');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_to_comments" ADD COLUMN "vote_status" "vote_status" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_posts" ADD COLUMN "vote_status" "vote_status" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_comments" DROP COLUMN IF EXISTS "upvoted";--> statement-breakpoint
ALTER TABLE "users_to_comments" DROP COLUMN IF EXISTS "downvoted";--> statement-breakpoint
ALTER TABLE "users_to_posts" DROP COLUMN IF EXISTS "upvoted";--> statement-breakpoint
ALTER TABLE "users_to_posts" DROP COLUMN IF EXISTS "downvoted";