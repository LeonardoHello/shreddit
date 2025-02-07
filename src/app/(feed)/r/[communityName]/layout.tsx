import { auth as authPromise } from "@clerk/nextjs/server";

import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityHeaderPlaceholder from "@/components/community/CommunityHeaderPlaceholder";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function CommunityLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  if (auth.userId) {
    void trpc.community.getUserToCommunity.prefetch(params.communityName);
  }
  void trpc.community.getCommunityByName.prefetch(params.communityName);
  void trpc.postFeed.getCommunityPosts.prefetchInfinite({
    sort: PostSort.BEST,
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

        <div className="flex justify-center gap-4">
          {props.children}

          <CommunitySidebar communityName={params.communityName} />
        </div>
      </HydrateClient>
    </main>
  );
}
