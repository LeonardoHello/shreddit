import { auth } from "@clerk/nextjs/server";

import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedUserPosts from "@/components/feed/FeedUserPosts";
import { trpc } from "@/trpc/server";
import { PostSort, QueryInfo } from "@/types";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const paramsPromise = props.params;
  const searchParamsPromise = props.searchParams;
  const currentAuthPromise = auth();

  const [params, searchParams, currentAuth] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
    currentAuthPromise,
  ]);

  const infiniteQueryPosts = await trpc.postFeed.getUserPosts({
    sort: searchParams.sort,
    username: params.username,
  });

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: {
      cursor: infiniteQueryPosts.nextCursor,
      sort: searchParams.sort,
      username: params.username,
    },
  };

  if (infiniteQueryPosts.posts.length === 0) {
    return <FeedEmpty params={params} />;
  }

  return (
    <FeedUserPosts
      key={searchParams.sort}
      currentUserId={currentAuth.userId}
      initialPosts={infiniteQueryPosts}
      queryInfo={queryInfo}
    />
  );
}
