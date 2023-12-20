import { and, eq } from "drizzle-orm";

import db from "../db";
import { type UserToCommunity, usersToCommunities } from "../db/schema";

export const setFavoriteCommunity = ({
  userId,
  communityId,
  favorite,
}: Pick<UserToCommunity, "userId" | "communityId" | "favorite">) => {
  return db
    .update(usersToCommunities)
    .set({ favorite })
    .where(
      and(
        eq(usersToCommunities.userId, userId),
        eq(usersToCommunities.communityId, communityId),
      ),
    )
    .returning({ favorite: usersToCommunities.favorite });
};

export const getCommunity = db.query.communities
  .findFirst({
    where: (community, { sql, eq }) =>
      eq(community.name, sql.placeholder("communityName")),
    with: {
      usersToCommunities: {
        columns: { createdAt: true },
      },
    },
  })
  .prepare("get_community");
