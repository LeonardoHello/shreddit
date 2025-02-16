import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import CommunityHeader from "@/components/community/CommunityHeader";
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
    <div className="container flex grow flex-col gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrateClient>
        <div className="order-2 flex justify-center gap-4">
          {props.children}

          <Suspense fallback={<CommunitySidebarSkeleton />}>
            <CommunitySidebar communityName={params.communityName} />
          </Suspense>
        </div>

        <Suspense fallback={<CommunityHeaderSkeleton />}>
          <CommunityHeader
            currentUserId={auth.userId}
            communityName={params.communityName}
          />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
