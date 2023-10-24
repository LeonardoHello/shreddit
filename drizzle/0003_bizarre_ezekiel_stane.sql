ALTER TABLE "users_to_communities" DROP CONSTRAINT "users_to_communities_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "communities" ALTER COLUMN "nsfw" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_communities" ALTER COLUMN "muted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_communities" ALTER COLUMN "favorite" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
