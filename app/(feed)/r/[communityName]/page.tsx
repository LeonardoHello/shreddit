import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getCommunityBestPosts } from "@/lib/api/posts/getCommunityPosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function CommunityPage({
  params: { communityName },
}: {
  params: { communityName: string };
}) {
  const { userId } = auth();

  const posts = await getCommunityBestPosts.execute({
    offset: 0,
    communityName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"communityBest"> = {
    procedure: "communityBest",
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
