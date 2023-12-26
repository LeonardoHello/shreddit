ALTER TABLE "comments" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ALTER COLUMN "about" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "communities" ALTER COLUMN "about" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET NOT NULL;