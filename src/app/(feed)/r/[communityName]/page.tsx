import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityHeaderPlaceholder from "@/components/community/CommunityHeaderPlaceholder";
import CommunityHeaderSkeleton from "@/components/community/CommunityHeaderSkeleton";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunitySidebarSkeleton from "@/components/community/CommunitySidebarSkeleton";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function CommunityPage(props: {
  params: Promise<{ communityName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, searchParams, auth] = await Promise.all([
    props.params,
    props.searchParams,
    authPromise(),
  ]);

  const { data: sort = PostSort.BEST } = z
    .nativeEnum(PostSort)
    .safeParse(searchParams.sort);

  if (auth.userId) {
    void trpc.community.getUserToCommunity.prefetch(params.communityName);
  }
  void trpc.community.getCommunityByName.prefetch(params.communityName);
  void trpc.postFeed.getCommunityPosts.prefetchInfinite({
    sort,
    communityName: params.communityName,
  });

  return (
    <main className="container flex grow flex-col gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <HydrateClient>
        <Suspense fallback={<CommunityHeaderSkeleton />}>
          {auth.userId && (
            <CommunityHeader
              currentUserId={auth.userId}
              communityName={params.communityName}
            />
          )}
          {!auth.userId && (
            <CommunityHeaderPlaceholder communityName={params.communityName} />
          )}
        </Suspense>
      </HydrateClient>

      <div className="flex justify-center gap-4">
        <HydrateClient>
          <Suspense fallback={<FeedPostInfiniteQuerySkeleton />}>
            <FeedPostInfiniteQuery
              currentUserId={auth.userId}
              infiniteQueryOptions={{
                procedure: "getCommunityPosts",
                input: {
                  sort,
                  communityName: params.communityName,
                },
              }}
            />
          </Suspense>
        </HydrateClient>

        <HydrateClient>
          <Suspense fallback={<CommunitySidebarSkeleton />}>
            <CommunitySidebar
              currentUserId={auth.userId}
              communityName={params.communityName}
            />
          </Suspense>
        </HydrateClient>
      </div>
    </main>
  );
}
