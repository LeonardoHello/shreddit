import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getUserBestPosts } from "@/lib/api/posts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function UserPage({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const { userId } = auth();

  const posts = await getUserBestPosts.execute({
    offset: 0,
    userName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"getUserBestPosts"> = {
    procedure: "getUserBestPosts",
    input: { userName },
  };

  return (
    <Posts
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
