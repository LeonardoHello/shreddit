import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function CommunityPage({
  params: { communityName },
  searchParams: { sort },
}: {
  params: { communityName: string };
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getCommunityHotPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.NEW:
      posts = await getCommunityNewPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getCommunityControversialPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    default:
      posts = await getCommunityBestPosts.execute({
        offset: 0,
        communityName,
      });
      break;
  }

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: { communityName, sort },
  };

  return (
    <Posts<"getCommunityPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
