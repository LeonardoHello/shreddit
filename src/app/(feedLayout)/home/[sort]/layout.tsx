import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import * as z from "zod/mini";

import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { PostFeed, PostSort } from "@/types/enums";

export default async function HomeSortLayout(
  props: LayoutProps<"/home/[sort]">,
) {
  const params = await props.params;
  const { data: sort, success } = z.enum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", PostFeed.HOME, sort],
    queryFn: async ({ pageParam }) => {
      const res = await client.posts.home.$get({
        query: { sort, cursor: pageParam },
      });
      return res.json();
    },
    initialPageParam: undefined,
  });

  return (
    <div className="container flex grow gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {props.children}
      </HydrationBoundary>
      <div className="hidden w-80 xl:block" />
    </div>
  );
}
