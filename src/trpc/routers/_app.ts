import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { commentRouter } from "./comment";
import { communityRouter } from "./community";
import { fileRouter } from "./file";
import { postRouter } from "./post";
import { postFeedRouter } from "./postFeed";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  community: communityRouter,
  postFeed: postFeedRouter,
  post: postRouter,
  comment: commentRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
