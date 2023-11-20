import { RouterOutput } from "@/trpc/server/procedures";

export default function getOnions(user: RouterOutput["searchUsers"][0]) {
  let onions = 0;

  // +1 onion for each upvoted comment
  user.comments.forEach((comment) => {
    let upvotes = 0;
    upvotes += comment.downvoted?.length ?? 0;
    upvotes -= comment.downvoted?.length ?? 0;

    if (upvotes > 0) {
      onions += upvotes;
    }
  });

  // +1 onion for each upvoted post
  user.posts.forEach((post) => {
    let upvotes = 0;
    upvotes += post.downvoted?.length ?? 0;
    upvotes -= post.downvoted?.length ?? 0;

    if (upvotes > 0) {
      onions += upvotes;
    }
  });

  user.usersToCommunities.forEach((moderatedCommunities) => {
    // +1 onion for each community member
    onions += moderatedCommunities.community.usersToCommunities.length;
  });

  return onions;
}
