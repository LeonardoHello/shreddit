import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getCommunityControversialPosts } from "@/lib/api/posts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function CommunityPageControversial({
  params: { communityName },
}: {
  params: { communityName: string };
}) {
  const { userId } = auth();

  const posts = await getCommunityControversialPosts.execute({
    offset: 0,
    communityName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"getCommunityControversialPosts"> = {
    procedure: "getCommunityControversialPosts",
    input: { communityName },
  };

  return (
    <Posts
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
