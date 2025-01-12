import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityHeaderAuthenticated from "@/components/community/CommunityHeaderAuthenticated";
import CommunityHeaderSkeleton from "@/components/community/CommunityHeaderSkeleton";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunitySidebarSkeleton from "@/components/community/CommunitySidebarSkeleton";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";
import FeedSort from "@/components/feed/FeedSort";
import { HydrateClient, trpc } from "@/trpc/server";
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

  if (auth.userId) {
    void trpc.community.getUserToCommunity.prefetch(params.communityName);
  }

  void trpc.postFeed.getCommunityPosts.prefetchInfinite({
    sort: searchParams.sort,
    communityName: params.communityName,
  });

  return (
    <div className="container flex flex-col gap-4 p-2 pb-6 2xl:max-w-[1080px]">
      <HydrateClient>
        <Suspense fallback={<CommunityHeaderSkeleton />}>
          {auth.userId && (
            <CommunityHeaderAuthenticated
              communityName={params.communityName}
            />
          )}
          {!auth.userId && (
            <CommunityHeader communityName={params.communityName} />
          )}
        </Suspense>

        <div className="flex justify-center gap-4">
          <div className="flex grow flex-col gap-4">
            <FeedSort />
            <Suspense fallback={<FeedPostInfiniteQuerySkeleton />}>
              <FeedPostInfiniteQuery
                key={searchParams.sort}
                currentUserId={auth.userId}
                infiniteQueryOptions={{
                  procedure: "getCommunityPosts",
                  input: {
                    sort: searchParams.sort,
                    communityName: params.communityName,
                  },
                }}
              />
            </Suspense>
          </div>

          <Suspense fallback={<CommunitySidebarSkeleton />}>
            <CommunitySidebar
              currentUserId={auth.userId}
              communityName={params.communityName}
            />
          </Suspense>
        </div>
      </HydrateClient>
    </div>
  );
}
