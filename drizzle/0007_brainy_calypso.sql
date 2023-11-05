ALTER TABLE "users" RENAME COLUMN "username" TO "name";--> statement-breakpoint
ALTER TABLE "users_to_communities" RENAME COLUMN "author_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "users_to_communities" DROP CONSTRAINT "users_to_communities_author_id_community_id";--> statement-breakpoint
ALTER TABLE "communities" DROP CONSTRAINT "communities_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_communities" DROP CONSTRAINT "users_to_communities_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_communities" ALTER COLUMN "user_id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "downvoted" varchar(256)[] NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "image_url" varchar(256);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "downvoted" varchar(256)[] NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_communities" ADD COLUMN "member" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_communities" ADD COLUMN "author" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "communities" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "users" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "users_to_communities" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "communities" DROP COLUMN IF EXISTS "author_id";--> statement-breakpoint
ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_user_id_community_id" PRIMARY KEY("user_id","community_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_name_unique" UNIQUE("name");