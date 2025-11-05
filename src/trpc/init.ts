import { cache } from "react";

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import * as z from "zod";

import { getSession } from "@/app/actions";
import db from "@/db";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session = await getSession();
  return { db, userId: session && session.session.userId };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */

  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError
            ? z.treeifyError(error.cause)
            : null,
      },
    };
  },
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  return opts.next({
    ctx: {
      userId: ctx.userId,
    },
  });
});
