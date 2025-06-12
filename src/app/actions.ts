"use server";

import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

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
