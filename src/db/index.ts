import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as commentsSchema from "./schema/comments";
import * as communitiesSchema from "./schema/communities";
import * as postsSchema from "./schema/posts";
import * as usersSchema from "./schema/users";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({
  client: sql,
  schema: {
    ...usersSchema,
    ...communitiesSchema,
    ...postsSchema,
    ...commentsSchema,
  },
  casing: "snake_case",
});

export default db;
