import { createFactory, createMiddleware } from "hono/factory";

import db from "@/db";
import { auth } from "@/lib/auth";

type UserId = typeof auth.$Infer.Session.session.userId;

type Env = {
  Variables: {
    db: typeof db;
    userId: UserId | null;
  };
};

export const factory = createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      c.set("db", db);
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        c.set("userId", null);
        await next();
        return;
      }
      c.set("userId", session.session.userId);
      await next();
    });
  },
});

type MiddlewareEnv = {
  Variables: {
    userId: UserId;
  };
};

// Ensures the user is authenticated
export const mw = createMiddleware<MiddlewareEnv>(async (c, next) => {
  const userId = c.get("userId");

  if (!userId) return c.text("unauthorized", 401);

  await next();
});
