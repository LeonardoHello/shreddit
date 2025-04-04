import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const preferredRegion = ["fra1"];
export const runtime = "edge";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
