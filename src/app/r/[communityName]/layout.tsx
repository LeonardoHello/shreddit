import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityHeaderPlaceholder from "@/components/community/CommunityHeaderPlaceholder";
import CommunityHeaderSkeleton from "@/components/community/CommunityHeaderSkeleton";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunitySidebarSkeleton from "@/components/community/CommunitySidebarSkeleton";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function CommunityLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string; sort: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  if (auth.userId) {
    void trpc.community.getUserToCommunity.prefetch(params.communityName);
  }
  void trpc.community.getCommunityByName.prefetch(params.communityName);

  return (
    <main className="container flex grow flex-col gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <HydrateClient>
        <div className="order-2 flex justify-center gap-4">
          {props.children}

          <Suspense fallback={<CommunitySidebarSkeleton />}>
            <CommunitySidebar communityName={params.communityName} />
          </Suspense>
        </div>

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
    </main>
  );
}
