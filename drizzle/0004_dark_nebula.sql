ALTER TABLE "comments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET NOT NULL;