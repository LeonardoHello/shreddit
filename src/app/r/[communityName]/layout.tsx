import { auth as authPromise } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function CommunityLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string; sort: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  const queryClient = getQueryClient();

  if (auth.userId) {
    void queryClient.prefetchQuery(
      trpc.community.getUserToCommunity.queryOptions(params.communityName),
    );
  }

  void queryClient.prefetchQuery(
    trpc.community.getCommunityByName.queryOptions(params.communityName),
  );

  return (
    <div className="container flex grow flex-col gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommunityHeader
          currentUserId={auth.userId}
          communityName={params.communityName}
        />

        <div className="flex justify-center gap-4">
          {props.children}

          <CommunitySidebar communityName={params.communityName} />
        </div>
      </HydrationBoundary>
    </div>
  );
}
