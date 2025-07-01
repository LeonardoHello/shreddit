"use server";

import { cache } from "react";
import { cookies, headers } from "next/headers";

import { eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema/users";
import { auth } from "@/lib/auth";

export const deleteAccount = async () => {
  const [session, nextHeaders] = await Promise.all([getSession(), headers()]);

  if (!session) {
    throw new Error("You must be logged in to delete your account.");
  }

  let message = undefined;

  try {
    await auth.api.signOut({ headers: nextHeaders });
    await db.delete(users).where(eq(users.id, session.session.userId));

    message = {
      error: false,
      message: "Your account has been successfully deleted.",
    };
  } catch {
    message = {
      error: true,
      message:
        "An error occurred while deleting your account. Please try again later.",
    };
  }

  return message;
};

export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
);

export const setCookie = async (data: {
  SIDEBAR_COOKIE_NAME: "sidebar_state";
  openState: boolean;
  SIDEBAR_COOKIE_MAX_AGE: number;
}) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: data.SIDEBAR_COOKIE_NAME,
    value: String(data.openState),
    path: "/",
    maxAge: data.SIDEBAR_COOKIE_MAX_AGE,
  });
};
