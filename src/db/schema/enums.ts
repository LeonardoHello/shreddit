import { pgEnum } from "drizzle-orm/pg-core";

export const voteStatusEnum = pgEnum("vote_status_enum", [
  "upvoted",
  "downvoted",
  "none",
]);
