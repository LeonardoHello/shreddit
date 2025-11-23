import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostFeed, PostSort } from "@/types/enums";

export default async function CommunityLayout(
  props: LayoutProps<"/r/[communityName]/[sort]">,
) {
  const params = await props.params;

  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", PostFeed.COMMUNITY, params.communityName, sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.posts.communities[":communityName"].$get({
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
