import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";

export default async function CommunitySubmitLayout(
  props: LayoutProps<"/submit/r/[communityName]">,
) {
  const [params, headers] = await Promise.all([props.params, nextHeaders()]);

  const client = createClient(headers);
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["communities", params.communityName, "submit"],
    queryFn: async () => {
      const res = await client.communities[":communityName"].submit.$get({
        param: { communityName: params.communityName },
      });

      const data = await res.json();

      if (!data) {
        notFound();
      }

      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
