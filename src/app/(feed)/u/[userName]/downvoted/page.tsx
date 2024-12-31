import { permanentRedirect } from "next/navigation";

import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import FeedDownvotedPosts from "@/components/feed/FeedDownvotedPosts";
import FeedEmpty from "@/components/feed/FeedEmpty";
import { trpc } from "@/trpc/server";
import { PostSort, QueryInfo } from "@/types";

export default async function DownvotedPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    currentUserPromise(),
  ]);

  if (!currentUser) permanentRedirect(`/u/${params.username}`);

  if (currentUser.username !== params.username)
    permanentRedirect(`/u/${params.username}`);

  const infiniteQueryPosts = await trpc.postFeed.getDownvotedPosts({
    sort: searchParams.sort,
  });

  const queryInfo: QueryInfo<"getDownvotedPosts"> = {
    procedure: "getDownvotedPosts",
    input: {
      cursor: infiniteQueryPosts.nextCursor,
      sort: searchParams.sort,
    },
  };

  if (infiniteQueryPosts.posts.length === 0) {
    return <FeedEmpty params={params} />;
  }

  return (
    <FeedDownvotedPosts
      key={searchParams.sort}
      currentUserId={currentUser && currentUser.id}
      initialPosts={infiniteQueryPosts}
      queryInfo={queryInfo}
    />
  );
}
