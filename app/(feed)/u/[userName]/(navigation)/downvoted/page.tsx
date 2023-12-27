import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getDownvotedBestPosts,
  getDownvotedControversialPosts,
  getDownvotedHotPosts,
  getDownvotedNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function UserDownvotedPage({
  searchParams: { sort },
}: {
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getDownvotedHotPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.NEW:
      posts = await getDownvotedNewPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getDownvotedControversialPosts.execute({
        offset: 0,
        userId,
      });
      break;

    default:
      posts = await getDownvotedBestPosts.execute({
        offset: 0,
        userId,
      });
      break;
  }

  let nextCursor: QueryInfo<"getDownvotedPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getDownvotedPosts"> = {
    procedure: "getDownvotedPosts",
    input: { sort },
  };

  return (
    <Posts<"getDownvotedPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
