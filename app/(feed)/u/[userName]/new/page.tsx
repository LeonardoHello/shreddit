import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getUserNewPosts } from "@/lib/api/posts/getUserPosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function UserPageNew({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const { userId } = auth();

  const posts = await getUserNewPosts.execute({
    offset: 0,
    userName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"userNew"> = {
    procedure: "userNew",
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
