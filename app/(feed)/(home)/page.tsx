import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getHomeBestPosts,
  getHomeControversialPosts,
  getHomeHotPosts,
  getHomeNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function HomePage({
  searchParams: { sort },
}: {
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getHomeHotPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.NEW:
      posts = await getHomeNewPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getHomeControversialPosts.execute({
        offset: 0,
        userId,
      });
      break;

    default:
      posts = await getHomeBestPosts.execute({
        offset: 0,
        userId,
      });
      break;
  }

  let nextCursor: QueryInfo<"getHomePosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getHomePosts"> = {
    procedure: "getHomePosts",
    input: { sort },
  };

  return (
    <Posts<"getHomePosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
