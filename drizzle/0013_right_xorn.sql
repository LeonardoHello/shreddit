ALTER TABLE "communities" DROP CONSTRAINT "communities_moderator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "communities" DROP COLUMN IF EXISTS "moderator_id";