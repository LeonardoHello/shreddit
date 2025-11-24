import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedAll = factory
  .createApp()
  .get("/all", feedHonoValidation, async (c) => {
    const query = c.req.valid("query");
    const currentUserId = c.get("currentUserId");
    const db = c.get("db");

    return feedHonoResponse(c, query, currentUserId, db, true, true);
  });
