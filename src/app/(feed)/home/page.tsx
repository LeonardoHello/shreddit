import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";
import FeedSort from "@/components/feed/FeedSort";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function HomePage(props: {
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [searchParams, auth] = await Promise.all([
    props.searchParams,
    authPromise(),
  ]);

  if (auth.userId === null)
    throw new Error("Could not load home page information.");

  void trpc.postFeed.getHomePosts.prefetchInfinite({ sort: searchParams.sort });

  return (
    <div className="container flex gap-6 p-2 pb-6 2xl:max-w-[1080px]">
      <div className="flex grow flex-col gap-4">
        <FeedSort />
        <HydrateClient>
          <Suspense fallback={<FeedPostInfiniteQuerySkeleton />}>
            <FeedPostInfiniteQuery
              currentUserId={auth.userId}
              infiniteQueryOptions={{
                procedure: "getHomePosts",
                input: {
                  sort: searchParams.sort,
                },
              }}
            />
          </Suspense>
        </HydrateClient>
      </div>
      <div className="hidden w-80 lg:block" />
    </div>
  );
}
