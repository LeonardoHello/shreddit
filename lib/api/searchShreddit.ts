import { eq, ilike, sql } from "drizzle-orm";

import { communities, users, usersToCommunities } from "@/lib/db/schema";

import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    where: ilike(users.name, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
  })
  .prepare("getSearchedUsers");

export const searchCommunities = db.query.communities
  .findMany({
    where: ilike(communities.name, sql.placeholder("search")),
    columns: { name: true, imageUrl: true, nsfw: true },
    limit: 4,
    with: {
      usersToCommunities: {
        where: eq(usersToCommunities.member, true),
        columns: { communityId: true },
      },
    },
  })
  .prepare("getSearchedCommunities");
