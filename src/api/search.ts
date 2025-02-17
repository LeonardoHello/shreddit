import { sql } from "drizzle-orm";

import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    limit: 4,
    columns: { username: true, imageUrl: true },
    where: (user, { ilike, sql }) =>
      ilike(user.username, sql.placeholder("search")),
    extras: (user, { sql }) => ({
      onionCount: sql<number>`
        (
          SELECT COALESCE(SUM(
            CASE 
              WHEN vote_status = 'upvoted' THEN 1
              WHEN vote_status = 'downvoted' THEN -1
              ELSE 0
            END
          ), 0)
          FROM users_to_posts
          WHERE users_to_posts.user_id = ${user.id}
        ) + 
        (
          SELECT COALESCE(SUM(
            CASE 
              WHEN vote_status = 'upvoted' THEN 1
              WHEN vote_status = 'downvoted' THEN -1
              ELSE 0
            END
          ), 0)
          FROM users_to_comments
          WHERE users_to_comments.user_id = ${user.id}
        ) + 
        (
          SELECT COUNT(*) 
          FROM users_to_communities
          WHERE users_to_communities.user_id = ${user.id}
            AND users_to_communities.joined = true
        )
      `.as("onion_count"),
    }),
  })
  .prepare("searched_users");

export const searchCommunities = db.query.communities
  .findMany({
    limit: sql.placeholder("limit"),
    where: (community, { ilike, sql }) =>
      ilike(community.name, sql.placeholder("search")),
    columns: { id: true, name: true, icon: true },
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
