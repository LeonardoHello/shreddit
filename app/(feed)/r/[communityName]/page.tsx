import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getCommunityBestPosts } from "@/lib/api/posts";
import { PostSortBy, type QueryInfo } from "@/lib/types";

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

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: { sortBy: PostSortBy.BEST, communityName },
  };

  return (
    <Posts<"getCommunityPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
