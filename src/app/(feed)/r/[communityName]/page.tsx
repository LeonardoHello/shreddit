import { auth } from "@clerk/nextjs/server";

import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/api/getPosts/getCommunityPosts";
import { getUserById } from "@/api/getUser";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import InfiniteQueryCommunityPosts from "@/components/infiniteQuery/InfiniteQueryCommunityPosts";
import InfiniteQueryPostsEmpty from "@/components/infiniteQuery/InfiniteQueryPostsEmpty";
import { PostSort, type QueryInfo } from "@/types";

export default async function CommunityPage(props: {
  params: Promise<{ communityName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { userId } = await auth();

  const { communityName } = params;
  const { sort } = searchParams;

  let postsData;
  switch (sort) {
    case PostSort.HOT:
      postsData = getCommunityHotPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case PostSort.NEW:
      postsData = getCommunityNewPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case PostSort.CONTROVERSIAL:
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

      {posts.length === 0 ? (
        <InfiniteQueryPostsEmpty params={{}} searchParams={searchParams} />
      ) : (
        <InfiniteQueryCommunityPosts
          currentUserId={userId}
          initialPosts={{ posts, nextCursor }}
          queryInfo={queryInfo}
        />
      )}
    </>
  );
}
