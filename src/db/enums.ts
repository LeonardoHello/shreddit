import { pgEnum } from "drizzle-orm/pg-core";

export const voteStatusEnum = pgEnum("vote_status", [
  "upvoted",
  "downvoted",
  "none",
]);
