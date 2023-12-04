import { RouterOutput } from "@/trpc/procedures";
import type { ArrElement } from "@/types";

export default function getOnions(
  user: ArrElement<RouterOutput["searchUsers"]>,
) {
  // +1 onion for each upvoted comment
  const commentUpvotes = user.usersToComments.reduce((a, b) => {
    return b.upvoted ? a + 1 : b.downvoted ? a - 1 : a;
  }, 0);

  // +1 onion for each upvoted post
  const commentAndPostUpvotes = user.usersToPosts.reduce((a, b) => {
    return b.upvoted ? a + 1 : b.downvoted ? a - 1 : a;
  }, commentUpvotes);

  // +1 onion for each community member
  const totalUpvotesAndMembers = user.communities.reduce((a, b) => {
    // length is the count of members from my communities
    return a + b.usersToCommunities.length;
  }, commentAndPostUpvotes);

  return totalUpvotesAndMembers || 0;
}
