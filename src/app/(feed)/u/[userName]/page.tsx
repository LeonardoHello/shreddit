import { Suspense } from "react";

import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    // currentUser function is deduped from layout
    currentUserPromise(),
  ]);

  void trpc.postFeed.getUserPosts.prefetchInfinite({
    sort: searchParams.sort,
    username: params.username,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<FeedPostInfiniteQuerySkeleton />}>
        <FeedPostInfiniteQuery
          key={searchParams.sort}
          currentUserId={currentUser && currentUser.id}
          infiniteQueryOptions={{
            procedure: "getUserPosts",
            input: {
              sort: searchParams.sort,
              username: params.username,
            },
          }}
        />
      </Suspense>
    </HydrateClient>
  );
}
