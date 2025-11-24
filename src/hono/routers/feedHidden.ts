import { and, eq, exists } from "drizzle-orm";

import { posts, usersToPosts } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedHidden = factory
  .createApp()
  .get("/:username/hidden", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");
    const currentUserId = c.get("currentUserId");
    const db = c.get("db");

    return feedHonoResponse(
      c,
      query,
      currentUserId,
      db,
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
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
    );
  });
