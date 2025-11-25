import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { createClient } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostSort } from "@/types/enums";

export default async function CommunityLayout(
  props: LayoutProps<"/r/[communityName]/[sort]">,
) {
  const [params, headers] = await Promise.all([props.params, nextHeaders()]);

  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const client = createClient(headers);
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["communities", params.communityName, "posts", sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.communities[":communityName"].posts.$get({
        param: { communityName: params.communityName },
        query: { sort, cursor: pageParam },
      });
      return res.json();
    },
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
