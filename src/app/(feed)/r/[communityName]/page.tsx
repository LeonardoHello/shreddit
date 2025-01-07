import { auth as authPromise } from "@clerk/nextjs/server";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedSort from "@/components/feed/FeedSort";
import { PostSort } from "@/types";

export default async function CommunityPage(props: {
  params: Promise<{ communityName: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [params, searchParams, auth] = await Promise.all([
    props.params,
    props.searchParams,
    authPromise(),
  ]);

  return (
    <>
      <div className="-order-1 flex flex-col gap-2.5">
        <FeedSort />
      </div>

      <FeedPostInfiniteQuery
        key={searchParams.sort}
        currentUserId={auth.userId}
        queryInfo={{
          procedure: "getCommunityPosts",
          input: {
            sort: searchParams.sort,
            communityName: params.communityName,
          },
        }}
      />
    </>
  );
}
