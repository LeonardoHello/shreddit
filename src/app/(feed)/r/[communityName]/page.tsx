import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityHeaderPlaceholder from "@/components/community/CommunityHeaderPlaceholder";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
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
        {auth.userId && (
          <CommunityHeader
            currentUserId={auth.userId}
            communityName={params.communityName}
          />
        )}
        {!auth.userId && (
          <CommunityHeaderPlaceholder communityName={params.communityName} />
        )}
      </HydrateClient>

      <div className="flex justify-center gap-4">
        <HydrateClient>
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
        </HydrateClient>

        <HydrateClient>
          <CommunitySidebar communityName={params.communityName} />
        </HydrateClient>
      </div>
    </main>
  );
}
