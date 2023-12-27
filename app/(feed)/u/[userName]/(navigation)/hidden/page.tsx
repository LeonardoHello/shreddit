import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getHiddenBestPosts,
  getHiddenControversialPosts,
  getHiddenHotPosts,
  getHiddenNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function UserHiddenPage({
  searchParams: { sort },
}: {
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getHiddenHotPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.NEW:
      posts = await getHiddenNewPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getHiddenControversialPosts.execute({
        offset: 0,
        userId,
      });
      break;

    default:
      posts = await getHiddenBestPosts.execute({
        offset: 0,
        userId,
      });
      break;
  }

  let nextCursor: QueryInfo<"getHiddenPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getHiddenPosts"> = {
    procedure: "getHiddenPosts",
    input: { sort },
  };

  return (
    <Posts<"getHiddenPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
