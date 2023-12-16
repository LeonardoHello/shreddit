import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getCommunityHotPosts } from "@/lib/api/posts/getCommunityPosts";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";
import type { InfinteQueryInfo } from "@/types";

export default async function CommunityPageHot({
  params: { communityName },
}: {
  params: { communityName: string };
}) {
  const { userId } = auth();

  const posts = await getCommunityHotPosts.execute({
    offset: 0,
    communityName,
  });

  const nextCursor = getInfiniteQueryCursor({
    postsLength: posts.length,
    cursor: 0,
  });

  const queryInfo: InfinteQueryInfo<"communityHot"> = {
    procedure: "communityHot",
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
