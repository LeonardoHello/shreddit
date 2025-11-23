import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedAll = factory
  .createApp()
  .get("/all", feedHonoValidation, async (c) => {
    const query = c.req.valid("query");

    return feedHonoResponse(c, c.var, query, true, true);
  });
