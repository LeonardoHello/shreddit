import { currentUser } from "@clerk/nextjs/server";

import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/api/getPosts/getCommunityPosts";
import FeedCommunityPosts from "@/components/feed/FeedCommunityPosts";
import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import { PostSort, type QueryInfo } from "@/types";

export default async function CommunityPage(props: {
  params: Promise<{ communityName: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const paramsPromise = props.params;
  const searchParamsPromise = props.searchParams;
  const userPromise = currentUser();

  const [params, searchParams, user] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
    userPromise,
  ]);

  let posts;
  switch (searchParams.sort) {
    case PostSort.HOT:
      posts = await getCommunityHotPosts.execute({
        currentUserId: user && user.id,
        communityName: params.communityName,
        offset: 0,
      });
      break;

    case PostSort.NEW:
      posts = await getCommunityNewPosts.execute({
        currentUserId: user && user.id,
        communityName: params.communityName,
        offset: 0,
      });
      break;

    case PostSort.CONTROVERSIAL:
      posts = await getCommunityControversialPosts.execute({
        currentUserId: user && user.id,
        communityName: params.communityName,
        offset: 0,
      });
      break;

    default:
      posts = await getCommunityBestPosts.execute({
        currentUserId: user && user.id,
        communityName: params.communityName,
        offset: 0,
      });
      break;
  }

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = undefined;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: {
      communityName: params.communityName,
      sort: searchParams.sort,
      currentUserId: user && user.id,
    },
  };

  return (
    <>
      <div className="-order-1 flex flex-col gap-2.5">
        {user && (
          <FeedInput
            username={user.username}
            imageUrl={user.imageUrl}
            communityName={params.communityName}
          />
        )}
        <FeedSort searchParams={searchParams} />
      </div>

      {posts.length === 0 ? (
        <FeedEmpty params={{}} searchParams={searchParams} />
      ) : (
        <FeedCommunityPosts
          key={searchParams.sort}
          currentUserId={user && user.id}
          initialPosts={{ posts, nextCursor }}
          queryInfo={queryInfo}
        />
      )}
    </>
  );
}
