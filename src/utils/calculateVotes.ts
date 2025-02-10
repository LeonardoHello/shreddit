import { UserToPost } from "@/db/schema/posts";

export const calculateVotes = ({
  voteCount,
  voteStatus,
  newVoteStatus,
}: {
  voteCount: number;
  voteStatus: UserToPost["voteStatus"];
  newVoteStatus: UserToPost["voteStatus"];
}) => {
  const voteCounter: Record<UserToPost["voteStatus"], number> = {
    downvoted: -1,
    none: 0,
    upvoted: 1,
  };

  return (
    Number(voteCount) + (-voteCounter[voteStatus] + voteCounter[newVoteStatus])
  );
};
