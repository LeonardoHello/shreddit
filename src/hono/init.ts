import { createFactory } from "hono/factory";

import db from "@/db";
import { auth, type UserId } from "@/lib/auth";

export type Env = {
  Variables: {
    db: typeof db;
    currentUserId: UserId;
  };
};

export const factory = createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      c.set("db", db);
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        c.set("currentUserId", null);
        await next();
        return;
      }
      c.set("currentUserId", session.session.userId);
      await next();
    });
  },
});
