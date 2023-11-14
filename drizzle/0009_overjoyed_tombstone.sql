ALTER TABLE "comments" ALTER COLUMN "upvoted" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "upvoted" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "downvoted" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "author_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "communities" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "communities" ALTER COLUMN "image_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "media" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "link" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "upvoted" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "upvoted" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "downvoted" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "author_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users_to_communities" ALTER COLUMN "user_id" SET DATA TYPE text;