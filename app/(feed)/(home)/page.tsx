import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getHomeBestPosts } from "@/lib/api/posts/getHomePosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function HomePage() {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  const posts = await getHomeBestPosts.execute({
    userId,
    offset: 0,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"homeBest"> = {
    procedure: "homeBest",
    input: {},
  };

  return (
    <Posts
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
