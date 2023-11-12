import { router } from "./";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
