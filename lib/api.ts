import db from "@/db";
import { users, communities, usersToCommunities } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";

export const getCurrentUser = (name: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, name),
  });
};

export const getSearchedUsers = (search: string) => {
  return db.query.users.findMany({
    where: ilike(users.name, `%${search}%`),
    limit: 5,
    with: {
      usersToCommunities: { columns: { userId: true, communityId: true } },
    },
  });
};

export const getSearchedCommunities = (search: string) => {
  return db.query.communities.findMany({
    where: ilike(communities.name, `%${search}%`),
    limit: 5,
    with: {
      usersToCommunities: { columns: { userId: true, communityId: true } },
    },
  });
};

export const getFavoriteCommunities = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.favorite, true),
    ),
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getOwnedCommunities = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.author, true),
    ),
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getJoinedCommunities = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.member, true),
    ),
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const toggleFavorite = (
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
