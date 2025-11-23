import { handle } from "hono/vercel";

import { app } from "@/hono/routers/_app";

export const preferredRegion = ["fra1"];
export const runtime = "edge";

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
