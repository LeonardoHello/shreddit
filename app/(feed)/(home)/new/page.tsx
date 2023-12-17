import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getHomeNewPosts } from "@/lib/api/posts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { RouterOutput } from "@/trpc/procedures";
import type { InfinteQueryInfo } from "@/types";

export default async function HomePageNew() {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  const posts = await getHomeNewPosts.execute({
    userId,
    offset: 0,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"getHomeNewPosts"> = {
    procedure: "getHomeNewPosts",
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
