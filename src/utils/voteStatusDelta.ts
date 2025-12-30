import type { UserToPost } from "@/db/schema/posts";
import { VoteStatusDelta } from "@/types/enums";

export const voteStatusDelta = ({
  oldStatus,
  newStatus,
}: {
  oldStatus: UserToPost["voteStatus"];
  newStatus: UserToPost["voteStatus"];
}) => {
  const values: Record<UserToPost["voteStatus"], number> = {
    upvoted: VoteStatusDelta["UPVOTED"],
    downvoted: VoteStatusDelta["DOWNVOTED"],
    none: VoteStatusDelta["NONE"],
  };

  return values[newStatus] - values[oldStatus];
};
