import type { NextRequest } from "next/server";

import {
  auth,
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";
import type { inferAsyncReturnType } from "@trpc/server";

import db from "@/db";

interface CreateInnerContextOptions {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createContextInner = (opts: CreateInnerContextOptions) => {
  return {
    auth: opts.auth,
    db,
  };
};

export const createContext = (opts: { req: NextRequest }) => {
  const contextInner = createContextInner({ auth: auth() });

  return { ...contextInner, req: opts.req };
};

export type Context = inferAsyncReturnType<typeof createContext>;
