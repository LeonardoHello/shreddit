import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { z } from "zod/v4";

import { getQueryClient, trpc } from "@/trpc/server";

export default async function PostLayout(
  props: LayoutProps<"/r/[communityName]/comments/[postId]">,
) {
  const params = await props.params;

  const { success } = z.uuid().safeParse(params.postId);

  if (!success) notFound();

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.post.getPost.queryOptions(params.postId));
  void queryClient.prefetchQuery(
    trpc.comment.getComments.queryOptions(params.postId),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
