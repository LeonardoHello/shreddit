import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { getQueryClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types/enums";

export default async function CommunityLayout(
  props: LayoutProps<"/r/[communityName]/[sort]">,
) {
  const params = await props.params;

  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.postFeed.getCommunityPosts.infiniteQueryOptions({
      sort,
      communityName: params.communityName,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
