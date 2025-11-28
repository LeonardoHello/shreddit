import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { username } from "better-auth/plugins";

import db from "@/db";
import * as commentsSchema from "@/db/schema/comments";
import * as communitiesSchema from "@/db/schema/communities";
import * as postsSchema from "@/db/schema/posts";
import * as usersSchema from "@/db/schema/users";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...usersSchema,
      ...communitiesSchema,
      ...postsSchema,
      ...commentsSchema,
    },
    usePlural: true,
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  plugins: [
    username({
      maxUsernameLength: 21,
    }),
  ],
});

export type UserId = typeof auth.$Infer.Session.session.userId | null;
