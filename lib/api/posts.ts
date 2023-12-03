import { and, eq, sql } from "drizzle-orm";

import db from "../db";
import {
  type Post,
  type UserToPost,
  usersToCommunities,
  usersToPosts,
} from "../db/schema";
import { posts } from "../db/schema";

export const getJoinedCommunitiesPosts = (userId: UserToPost["userId"]) => {
  return db.query.posts
    .findMany({
      limit: 10,
      where: (post, { exists }) =>
        exists(
          db
            .select()
            .from(usersToCommunities)
            .where(
              and(
                eq(usersToCommunities.userId, userId),
                eq(usersToCommunities.member, true),
                eq(usersToCommunities.userId, post.authorId),
              ),
            ),
        ),
      offset: sql.placeholder("offset"),
      with: {
        usersToPosts: true,
        community: { columns: { name: true, imageUrl: true } },
        author: { columns: { name: true } },
        comments: { columns: { id: true } },
        files: true,
      },
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    })
    .prepare("getJoinedCommunitiesPosts");
};
