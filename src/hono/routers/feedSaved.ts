import { and, eq, exists } from "drizzle-orm";

import { posts, usersToPosts } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedSaved = factory
  .createApp()
  .get("/:username/saved", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(
      c,
      c.var,
      query,
      false,
      false,
      exists(
        c.var.db
          .select()
          .from(usersToPosts)
          .innerJoin(
            users,
            and(
              eq(users.id, usersToPosts.userId),
              eq(users.username, username),
            ),
          )
          .where(
            and(
              eq(usersToPosts.postId, posts.id),
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
    );
  });
