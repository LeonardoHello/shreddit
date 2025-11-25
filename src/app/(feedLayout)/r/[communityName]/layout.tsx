import { headers as nextHeaders } from "next/headers";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getSession } from "@/app/actions";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";

export default async function CommunityLayout(
  props: LayoutProps<"/r/[communityName]">,
) {
  const [params, headers, session] = await Promise.all([
    props.params,
    nextHeaders(),
    getSession(),
  ]);

  const client = createClient(headers);
  const queryClient = getQueryClient();

  if (session) {
    queryClient.prefetchQuery({
      queryKey: ["users", "me", "communities", params.communityName],
      queryFn: async () => {
        const res = await client.users.me.communities[":communityName"].$get({
          param: { communityName: params.communityName },
        });

        return res.json();
      },
    });
  }

  queryClient.prefetchQuery({
    queryKey: ["communities", params.communityName],
    queryFn: async () => {
      const res = await client.communities[":communityName"].$get({
        param: { communityName: params.communityName },
      });

      return res.json();
    },
  });

  return (
    <div className="container flex grow flex-col gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommunityHeader
          currentUserId={session && session.session.userId}
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
