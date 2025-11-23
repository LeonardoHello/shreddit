import { and, eq, exists, sql } from "drizzle-orm";

import { usersToCommunities } from "@/db/schema/communities";
import { posts } from "@/db/schema/posts";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory, mwAuthenticated } from "../init";

export const feedHome = factory
  .createApp()
  .get("/home", mwAuthenticated, feedHonoValidation, async (c) => {
    const query = c.req.valid("query");

    return feedHonoResponse(
      c,
      c.var,
      query,
      true,
      true,
      exists(
        c.var.db
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
