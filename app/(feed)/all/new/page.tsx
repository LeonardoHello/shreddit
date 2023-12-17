import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getAllNewPosts } from "@/lib/api/posts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function AllPageNew() {
  const { userId } = auth();

  const posts = await getAllNewPosts.execute({ offset: 0 });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"getAllNewPosts"> = {
    procedure: "getAllNewPosts",
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
