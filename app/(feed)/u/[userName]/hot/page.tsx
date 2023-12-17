import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getUserHotPosts } from "@/lib/api/posts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function UserPageHot({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const { userId } = auth();

  const posts = await getUserHotPosts.execute({
    offset: 0,
    userName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"getUserHotPosts"> = {
    procedure: "getUserHotPosts",
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
