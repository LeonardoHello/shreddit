import { sql } from "drizzle-orm";

import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    where: (user, { ilike, sql }) =>
      ilike(user.username, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
    with: {
      usersToComments: {
        where: (userToCommunity, { ne }) =>
          ne(userToCommunity.voteStatus, "none"),
        columns: { voteStatus: true },
      },
      usersToPosts: {
        where: (userToCommunity, { ne }) =>
          ne(userToCommunity.voteStatus, "none"),
        columns: { voteStatus: true },
      },
      communities: {
        columns: {},
        with: {
          usersToCommunities: {
            columns: { communityId: true },
            where: (userToCommunity, { eq }) =>
              eq(userToCommunity.joined, true),
          },
        },
      },
    },
  })
  .prepare("searched_users");

export const searchCommunities = db.query.communities
  .findMany({
    where: (community, { ilike, sql }) =>
      ilike(community.name, sql.placeholder("search")),
    columns: { id: true, name: true, icon: true },
    limit: sql.placeholder("limit"),
    extras: (community, { sql }) => ({
      memberCount: sql<number>`
        (
          SELECT COUNT(*) 
          FROM users_to_communities 
          WHERE users_to_communities.community_id = ${community.id} 
            AND users_to_communities.joined = true
        )
      `.as("member_count"),
    }),
  })
  .prepare("searched_communities");
