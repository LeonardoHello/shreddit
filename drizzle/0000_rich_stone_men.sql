CREATE TABLE IF NOT EXISTS "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"text" text NOT NULL,
	"upvoted" varchar(256)[] DEFAULT ARRAY[]::varchar[],
	"author_id" varchar(256) NOT NULL,
	"post_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" varchar(256) NOT NULL,
	"about" text,
	"nsfw" boolean DEFAULT false,
	"author_id" varchar(256) NOT NULL,
	CONSTRAINT "communities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"title" varchar(256) NOT NULL,
	"text" text,
	"media" varchar(256),
	"link" varchar(256),
	"nsfw" boolean NOT NULL,
	"spoiler" boolean NOT NULL,
	"upvoted" varchar(256)[] DEFAULT ARRAY[]::varchar[],
	"author_id" varchar(256) NOT NULL,
	"community_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"onions" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_communities" (
	"author_id" varchar NOT NULL,
	"community_id" uuid NOT NULL,
	"muted" boolean DEFAULT false,
	CONSTRAINT users_to_communities_author_id_community_id PRIMARY KEY("author_id","community_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communities" ADD CONSTRAINT "communities_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_communities" ADD CONSTRAINT "users_to_communities_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
