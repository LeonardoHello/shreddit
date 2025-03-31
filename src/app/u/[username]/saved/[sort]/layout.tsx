import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { z } from "zod";

import { getQueryClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types/enums";

export default async function UserSavedLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string; sort: string }>;
}) {
  const params = await props.params;

  const { data: sort, success } = z.nativeEnum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.postFeed.getSavedPosts.infiniteQueryOptions({
      sort,
      username: params.username,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
