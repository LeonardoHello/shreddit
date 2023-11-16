import { eq, ilike, sql } from "drizzle-orm";

import { communities, users, usersToCommunities } from "@/lib/db/schema";

import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    where: ilike(users.name, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
    with: {
      comments: {
        columns: { updatedAt: true, downvoted: true },
      },
      posts: {
        columns: { updatedAt: true, downvoted: true },
      },
      usersToCommunities: {
        where: eq(usersToCommunities.author, true),
        columns: {},
        with: {
          community: {
            columns: {},
            with: {
              usersToCommunities: {
                columns: { communityId: true },
                where: eq(usersToCommunities.member, true),
              },
            },
          },
        },
      },
    },
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
