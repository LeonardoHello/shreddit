import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getUserControversialPosts } from "@/lib/api/posts/getUserPosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function UserPageControversial({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const { userId } = auth();

  const posts = await getUserControversialPosts.execute({
    offset: 0,
    userName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"userControversial"> = {
    procedure: "userControversial",
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
