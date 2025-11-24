import { and, eq, exists, sql } from "drizzle-orm";

import { usersToCommunities } from "@/db/schema/communities";
import { posts } from "@/db/schema/posts";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedHome = factory
  .createApp()
  .get("/home", feedHonoValidation, async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const query = c.req.valid("query");
    const db = c.get("db");

    return feedHonoResponse(
      c,
      query,
      currentUserId,
      db,
      true,
      true,
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
              eq(usersToCommunities.communityId, posts.communityId),
              eq(usersToCommunities.joined, true),
            ),
          ),
      ),
    );
  });
