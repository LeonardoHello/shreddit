import { validator } from "hono/validator";
import * as v from "valibot";

import { usersToComments, UserToCommentSchema } from "@/db/schema/comments";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

export const userToComment = factory.createApp().patch(
  `/:commentId{${reg}}/vote`,
  validator("json", (value, c) => {
    const parsed = v.safeParse(
      v.pick(UserToCommentSchema, ["voteStatus"]),
      value,
    );

    if (!parsed.success) {
      const error = parsed.issues[0];
      return c.text(`400 ${error.message}`, 400);
    }

    return parsed.output;
  }),
  async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const commentId = c.req.param("commentId");
    const json = c.req.valid("json");
    const db = c.get("db");

    await db
      .insert(usersToComments)
      .values({ commentId, userId: currentUserId, ...json })
      .onConflictDoUpdate({
        target: [usersToComments.userId, usersToComments.commentId],
        set: { voteStatus: json.voteStatus },
      });

    return c.text("success", 200);
  },
);
