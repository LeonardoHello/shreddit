import { CommunitySchema, UserSchema } from "@/db/schema";
import { getCommunityImageUrl, getUserImageUrl } from "@/lib/api";

import { protectedProcedure, router } from "./";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

export const appRouter = router({
  communityImage: protectedProcedure
    .input(CommunitySchema.shape.name.optional())
    .query(({ input }) => {
      if (input === undefined) return null;
      return getCommunityImageUrl.execute({ name: input });
    }),
  userImage: protectedProcedure
    .input(UserSchema.shape.name.optional())
    .query(({ input }) => {
      if (input === undefined) return null;
      return getUserImageUrl.execute({ name: input });
    }),
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
