import { appRouter } from "@/trpc/server/procedures";
import { auth } from "@clerk/nextjs/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const runtime = "edge";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ auth: auth() }),
  });

export { handler as GET, handler as POST };
