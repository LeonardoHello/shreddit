import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = procedure.use(isAuthed);
