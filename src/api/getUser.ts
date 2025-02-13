import db from "../db";

export const getUserByName = db.query.users
  .findFirst({
    where: (user, { sql, eq }) =>
      eq(user.username, sql.placeholder("username")),
    with: {
      communities: {
        columns: { id: true, icon: true, name: true },
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
      },
    },
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
          WHERE EXISTS (
            SELECT 1
            FROM communities
            WHERE communities.id = users_to_communities.community_id
              AND communities.moderator_id = ${user.id}
          )
        )
      `.as("onion_count"),
    }),
  })
  .prepare("user_by_name");
