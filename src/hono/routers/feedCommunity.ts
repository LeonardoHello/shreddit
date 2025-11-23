import { and, eq, exists } from "drizzle-orm";

import { communities } from "@/db/schema/communities";
import { posts } from "@/db/schema/posts";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedCommunity = factory
  .createApp()
  .get("/:communityName", feedHonoValidation, async (c) => {
    const communityName = c.req.param("communityName");
    const query = c.req.valid("query");

    return feedHonoResponse(
      c,
      c.var,
      query,
      true,
      false,
      exists(
        c.var.db
          .select({ id: communities.id })
          .from(communities)
          .where(
            and(
              eq(communities.id, posts.communityId),
              eq(communities.name, communityName),
            ),
          ),
      ),
    );
  });
