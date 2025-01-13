import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function AllPage(props: {
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [searchParams, auth] = await Promise.all([
    props.searchParams,
    authPromise(),
  ]);

  void trpc.postFeed.getAllPosts.prefetchInfinite({
    sort: searchParams.sort,
  });

  return (
    <div className="container flex gap-6 p-2 2xl:max-w-[1080px]">
      <HydrateClient>
        <Suspense fallback={<FeedPostInfiniteQuerySkeleton />}>
          <FeedPostInfiniteQuery
            currentUserId={auth.userId}
            infiniteQueryOptions={{
              procedure: "getAllPosts",
              input: {
                sort: searchParams.sort,
              },
            }}
          />
        </Suspense>
      </HydrateClient>

      <div className="hidden w-80 xl:block" />
    </div>
  );
}
