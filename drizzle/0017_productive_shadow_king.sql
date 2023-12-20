ALTER TABLE "users_to_comments" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_communities" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_posts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;