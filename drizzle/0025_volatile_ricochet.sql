ALTER TABLE "files" ADD CONSTRAINT "files_key_unique" UNIQUE("key");--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_url_unique" UNIQUE("url");