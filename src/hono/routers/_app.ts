import { Hono } from "hono";

import { user } from "./user";

export const app = new Hono().basePath("/api").route("/user", user);

export type AppType = typeof app;
