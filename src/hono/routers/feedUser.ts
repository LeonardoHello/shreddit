import { and, eq, exists } from "drizzle-orm";

import { posts } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const feedUser = factory
  .createApp()
  .get("/:username", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(
      c,
      c.var,
      query,
      true,
      false,
      exists(
        c.var.db
          .select()
          .from(users)
          .where(
            and(eq(users.id, posts.authorId), eq(users.username, username)),
          ),
      ),
    );
  });
