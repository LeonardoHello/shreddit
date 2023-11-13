import { and, desc, eq, inArray, sql } from "drizzle-orm";

import db from "../db";
import { posts, usersToCommunities } from "../db/schema";

export const getJoinedCommunitiesIds = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    columns: { communityId: true },
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.member, true),
    ),
  });
};

export const getJoinedCommunitiesPosts = (joinedCommunityIds: string[]) => {
  return db.query.posts
    .findMany({
      limit: 10,
      where: inArray(posts.communityId, joinedCommunityIds),
      offset: sql.placeholder("offset"),
      with: {
        community: { columns: { name: true, imageUrl: true } },
        author: { columns: { name: true } },
        comments: { columns: { id: true } },
      },
      orderBy: [desc(posts.createdAt)],
    })
    .prepare("getJoinedCommunitiesPosts");
};
