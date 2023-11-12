import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@/trpc/server/procedures";

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });
