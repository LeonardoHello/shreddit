import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { Resend } from "resend";

import DeleteAccountVerificationEmail from "@/components/email-template";
import db from "@/db";
import * as commentsSchema from "@/db/schema/comments";
import * as communitiesSchema from "@/db/schema/communities";
import * as postsSchema from "@/db/schema/posts";
import * as usersSchema from "@/db/schema/users";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
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
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({
        user, // The user object
        url, // The auto-generated URL for deletion
      }) => {
        // Your email sending logic here

        // {
        //   name: "validation_error",
        //   message:
        //     "You can only send testing emails to your own email address (leonardo.yakub@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain.",
        //   statusCode: 403,
        // };

        // doesn't work since resend only allows sending emails to verified domains

        await resend.emails.send({
          from: "Shreddit <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify Deletion",
          react: DeleteAccountVerificationEmail({
            verificationUrl: url,
            userEmail: user.email,
            userName: user.name,
          }),
        });
      },
    },
  },
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
    nextCookies(),
  ],
});
