import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getAllControversialPosts } from "@/lib/api/posts/getAllPosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function AllPageControversial() {
  const { userId } = auth();

  const posts = await getAllControversialPosts.execute({ offset: 0 });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"allControversial"> = {
    procedure: "allControversial",
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
