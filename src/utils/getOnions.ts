import { RouterOutput } from "@/trpc/procedures";
import type { ArrElement } from "@/types";

export default function getOnions(
  user: ArrElement<RouterOutput["searchUsers"]>,
) {
  // +1 onion for each upvoted comment
  const commentUpvotes = user.usersToComments.reduce(
    (accumulator, currentValue) => {
      return accumulator + (currentValue.voteStatus === "upvoted" ? 1 : -1);
    },
    0,
  );

  // +1 onion for each upvoted post
  const commentAndPostUpvotes = user.usersToPosts.reduce(
    (accumulator, currentValue) => {
      return accumulator + (currentValue.voteStatus === "upvoted" ? 1 : -1);
    },
    commentUpvotes,
  );

  // +1 onion for each community member
  const totalUpvotesAndMembers = user.communities.reduce(
    (accumulator, currentValue) => {
      // length is the count of members from my communities
      return accumulator + currentValue.usersToCommunities.length;
    },
    commentAndPostUpvotes,
  );

  return totalUpvotesAndMembers >= 0 ? totalUpvotesAndMembers : 0;
}
