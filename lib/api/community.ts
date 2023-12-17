import { and, eq } from "drizzle-orm";

import db from "../db";
import { type UserToCommunity, usersToCommunities } from "../db/schema";

export const setFavoriteCommunity = ({
  userId,
  communityId,
  favorite,
}: Omit<UserToCommunity, "muted" | "member">) => {
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
