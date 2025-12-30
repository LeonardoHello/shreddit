import { eq } from "drizzle-orm";
import { validator } from "hono/validator";
import * as v from "valibot";

import {
  comments,
  usersToComments,
  UserToCommentSchema,
} from "@/db/schema/comments";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

export const userToComment = factory.createApp().patch(
  `/:commentId{${reg}}/vote`,
  validator("json", (value, c) => {
    const parsed = v.safeParse(
      v.object({
        voteStatus: UserToCommentSchema.entries.voteStatus,
        voteCount: v.pipe(v.number(), v.integer()),
      }),
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
    const { voteStatus, voteCount } = c.req.valid("json");
    const db = c.get("db");

    await db.batch([
      db
        .insert(usersToComments)
        .values({ commentId, userId: currentUserId, voteStatus })
        .onConflictDoUpdate({
          target: [usersToComments.userId, usersToComments.commentId],
          set: { voteStatus },
        }),
      db.update(comments).set({ voteCount }).where(eq(comments.id, commentId)),
    ]);

    return c.text("success", 200);
  },
);
