import { auth } from "@clerk/nextjs";

import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import PostsInfiniteQuery from "@/components/post/PostsInfiniteQuery";
import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/lib/api/getPosts/getCommunityPosts";
import { getUserById } from "@/lib/api/getUser";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: { communityName: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  const { communityName } = params;
  const { sort } = searchParams;

  let postsData;
  switch (sort) {
    case SortPosts.HOT:
      postsData = getCommunityHotPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.NEW:
      postsData = getCommunityNewPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      postsData = getCommunityControversialPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    default:
      postsData = getCommunityBestPosts.execute({
        offset: 0,
        communityName,
      });
      break;
  }

  const userData = getUserById.execute({ currentUserId: userId });

  const [user, posts] = await Promise.all([userData, postsData]).catch(() => {
    throw new Error("There was a problem with loading community information.");
  });

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: { communityName, sort },
  };

  return (
    <>
      <div className="-order-1 flex flex-col gap-2.5">
        {user && <FeedInput user={user} communityName={communityName} />}
        <FeedSort searchParams={searchParams} />
      </div>
      <PostsInfiniteQuery
        currentUserId={userId}
        initialPosts={{ posts, nextCursor }}
        queryInfo={queryInfo}
        params={params}
        searchParams={searchParams}
      />
    </>
  );
}
