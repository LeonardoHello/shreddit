import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getUpvotedBestPosts,
  getUpvotedControversialPosts,
  getUpvotedHotPosts,
  getUpvotedNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function UserUpvotedPage({
  searchParams: { sort },
}: {
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getUpvotedHotPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.NEW:
      posts = await getUpvotedNewPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getUpvotedControversialPosts.execute({
        offset: 0,
        userId,
      });
      break;

    default:
      posts = await getUpvotedBestPosts.execute({
        offset: 0,
        userId,
      });
      break;
  }

  let nextCursor: QueryInfo<"getUpvotedPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUpvotedPosts"> = {
    procedure: "getUpvotedPosts",
    input: { sort },
  };

  return (
    <Posts<"getUpvotedPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
