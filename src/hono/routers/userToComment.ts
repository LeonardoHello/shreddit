import { validator } from "hono/validator";

import { usersToComments, UserToCommentSchema } from "@/db/schema/comments";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory, mwAuthenticated } from "../init";

export const userToComment = factory.createApp().patch(
  `/:commentId{${reg}}/vote`,
  validator("json", (value, c) => {
    const parsed = UserToCommentSchema.pick({
      voteStatus: true,
    }).safeParse(value);

    if (!parsed.success) {
      return c.text("400 Invalid search json", 400);
    }
    return parsed.data;
  }),
  mwAuthenticated,
  async (c) => {
    const commentId = c.req.param("commentId");
    const json = c.req.valid("json");

    await c.var.db
      .insert(usersToComments)
      .values({ commentId, userId: c.var.currentUserId, ...json })
      .onConflictDoUpdate({
        target: [usersToComments.userId, usersToComments.commentId],
        set: { voteStatus: json.voteStatus },
      });

    return c.status(204);
  },
);
