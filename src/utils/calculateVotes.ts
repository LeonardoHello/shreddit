import { UserToPost } from "@/db/schema";

export const calculateVotes = ({
  voteCount,
  voted,
  nextVote,
}: {
  voteCount: number;
  voted: UserToPost["voteStatus"];
  nextVote: UserToPost["voteStatus"];
}) => {
  const voteCounter: Record<UserToPost["voteStatus"], number> = {
    downvoted: -1,
    none: 0,
    upvoted: 1,
  };

  return Number(voteCount) + (-voteCounter[voted] + voteCounter[nextVote]);
};
