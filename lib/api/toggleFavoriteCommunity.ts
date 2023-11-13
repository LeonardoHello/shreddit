import { and, eq } from "drizzle-orm";

import db from "../db";
import { usersToCommunities } from "../db/schema";

const toggleFavoriteCommunity = (
  userId: string,
  communityId: string,
  favorite: boolean,
) => {
  return db
    .update(usersToCommunities)
    .set({ favorite })
    .where(
      and(
        eq(usersToCommunities.userId, userId),
        eq(usersToCommunities.communityId, communityId),
      ),
    );
};

export default toggleFavoriteCommunity;
