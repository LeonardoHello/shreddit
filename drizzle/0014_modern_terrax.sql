ALTER TABLE "comments" ADD COLUMN "reply_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "link";