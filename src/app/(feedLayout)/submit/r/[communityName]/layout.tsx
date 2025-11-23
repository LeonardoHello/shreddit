import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";

export default async function CommunitySubmitLayout(
  props: LayoutProps<"/submit/r/[communityName]">,
) {
  const params = await props.params;

  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["communities", params.communityName, "submit"],
    queryFn: async () => {
      const res = await client.communities[":communityName"].submit.$get({
        param: { communityName: params.communityName },
      });
      return res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
