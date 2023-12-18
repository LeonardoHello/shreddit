import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getCommunityNewPosts } from "@/lib/api/posts";
import { type QueryInfo, SortPostsBy } from "@/lib/types";

export default async function CommunityPageNew({
  params: { communityName },
}: {
  params: { communityName: string };
}) {
  const { userId } = auth();

  const posts = await getCommunityNewPosts.execute({
    offset: 0,
    communityName,
  });

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: { sortBy: SortPostsBy.NEW, communityName },
  };

  return (
    <Posts<"getCommunityPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
