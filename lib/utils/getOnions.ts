import { RouterOutput } from "@/trpc/server/procedures";

export default function getOnions(user: RouterOutput["searchUsers"][0]) {
  let onions = 0;

  // +2 onions for each comment
  onions += user.comments.length * 2;

  // +1 onion for each upvoted comment
  user.comments.forEach((comment) => {
    let upvotes = 0;
    upvotes += comment.downvoted?.length ?? 0;
    upvotes -= comment.downvoted?.length ?? 0;

    if (upvotes > 0) {
      onions += upvotes;
    }
  });

  // +3 onions for each post
  onions += user.posts.length * 3;

  // +1 onion for each upvoted post
  user.posts.forEach((post) => {
    let upvotes = 0;
    upvotes += post.downvoted?.length ?? 0;
    upvotes -= post.downvoted?.length ?? 0;

    if (upvotes > 0) {
      onions += upvotes;
    }
  });

  // +5 onions for each community
  onions += user.usersToCommunities.length * 5;

  user.usersToCommunities.forEach((moderatedCommunities) => {
    // +1 onion for each community member
    onions += moderatedCommunities.community.usersToCommunities.length;
  });

  return onions;
}
