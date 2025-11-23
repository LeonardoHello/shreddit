import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

export const preferredRegion = ["fra1"];
export const runtime = "edge";

export const { GET, POST } = toNextJsHandler(auth.handler);
