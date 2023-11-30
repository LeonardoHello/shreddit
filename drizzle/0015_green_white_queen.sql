CREATE TABLE IF NOT EXISTS "users_to_comments" (
	"user_id" text NOT NULL,
	"comment_id" uuid NOT NULL,
	"upvoted" boolean DEFAULT false NOT NULL,
	"downvoted" boolean DEFAULT false NOT NULL,
	"saved" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	CONSTRAINT users_to_comments_user_id_comment_id_pk PRIMARY KEY("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_posts" (
	"user_id" text NOT NULL,
	"post_id" uuid NOT NULL,
	"upvoted" boolean DEFAULT false NOT NULL,
	"downvoted" boolean DEFAULT false NOT NULL,
	"saved" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	CONSTRAINT users_to_posts_user_id_post_id_pk PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "reply_id" TO "parent_comment_id";--> statement-breakpoint
ALTER TABLE "users_to_communities" DROP CONSTRAINT "users_to_communities_user_id_community_id";--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "moderator_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "users_to_comments" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_id_idx" ON "users_to_comments" ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "users_to_posts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_id_idx" ON "users_to_posts" ("post_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communities" ADD CONSTRAINT "communities_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN IF EXISTS "upvoted";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN IF EXISTS "downvoted";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "upvoted";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "downvoted";--> statement-breakpoint
ALTER TABLE "users_to_communities" DROP COLUMN IF EXISTS "author";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_comments" ADD CONSTRAINT "users_to_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_comments" ADD CONSTRAINT "users_to_comments_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_posts" ADD CONSTRAINT "users_to_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_posts" ADD CONSTRAINT "users_to_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_user_id_community_id_pk" PRIMARY KEY("user_id","community_id");