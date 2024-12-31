import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedHiddenPosts from "@/components/feed/FeedHiddenPosts";
import { trpc } from "@/trpc/server";
import { PostSort, QueryInfo } from "@/types";

export default async function HiddenPage(props: {
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

  if (!currentAuth.userId) notFound();

  const infiniteQueryPosts = await trpc.postFeed.getHiddenPosts({
    sort: searchParams.sort,
  });

  const queryInfo: QueryInfo<"getHiddenPosts"> = {
    procedure: "getHiddenPosts",
    input: {
      cursor: infiniteQueryPosts.nextCursor,
      sort: searchParams.sort,
    },
  };

  if (infiniteQueryPosts.posts.length === 0) {
    return <FeedEmpty params={params} />;
  }

  return (
    <FeedHiddenPosts
      key={searchParams.sort}
      currentUserId={currentAuth.userId}
      initialPosts={infiniteQueryPosts}
      queryInfo={queryInfo}
    />
  );
}
