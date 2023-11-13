import { eq, sql } from "drizzle-orm";

import db from "../db";
import { communities, users } from "../db/schema";

export const getUserImageUrl = db.query.users
  .findFirst({
    where: eq(users.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("getUserImageUrl");

export const getCommunityImageUrl = db.query.communities
  .findFirst({
    where: eq(communities.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("getCommunityImageUrl");
