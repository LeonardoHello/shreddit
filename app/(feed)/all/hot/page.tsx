import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getAllHotPosts } from "@/lib/api/posts/getAllPosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function AllPageHot() {
  const { userId } = auth();

  const posts = await getAllHotPosts.execute({ offset: 0 });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"allHot"> = {
    procedure: "allHot",
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
