import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { getQueryClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types/enums";

export default async function HomeSortLayout(
  props: LayoutProps<"/home/[sort]">,
) {
  const params = await props.params;
  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.postFeed.getHomePosts.infiniteQueryOptions({ sort }),
  );

  return (
    <div className="container flex grow gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {props.children}
      </HydrationBoundary>
      <div className="hidden w-80 xl:block" />
    </div>
  );
}
