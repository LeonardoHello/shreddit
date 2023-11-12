ALTER TABLE "comments" ALTER COLUMN "downvoted" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "downvoted" DROP NOT NULL;