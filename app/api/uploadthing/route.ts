import { createNextRouteHandler } from "uploadthing/next";

import { uploadRouter } from "@/uploadthing/server";

// export const runtime = "edge";

export const { GET, POST } = createNextRouteHandler({
  router: uploadRouter,
});
