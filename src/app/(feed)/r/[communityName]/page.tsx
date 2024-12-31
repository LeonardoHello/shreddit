import { currentUser } from "@clerk/nextjs/server";

import FeedCommunityPosts from "@/components/feed/FeedCommunityPosts";
import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import { trpc } from "@/trpc/server";
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

  const infiniteQueryPosts = await trpc.postFeed.getCommunityPosts({
    sort: searchParams.sort,
    communityName: params.communityName,
  });

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: {
      cursor: infiniteQueryPosts.nextCursor,
      sort: searchParams.sort,
      communityName: params.communityName,
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
        <FeedSort />
      </div>

      {infiniteQueryPosts.posts.length === 0 ? (
        <FeedEmpty params={{}} />
      ) : (
        <FeedCommunityPosts
          key={searchParams.sort}
          currentUserId={user && user.id}
          initialPosts={infiniteQueryPosts}
          queryInfo={queryInfo}
        />
      )}
    </>
  );
}
