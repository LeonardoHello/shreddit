import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { z } from "zod";

import { getQueryClient, trpc } from "@/trpc/server";

export default async function PostLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string; postId: string }>;
}) {
  const params = await props.params;

  const { success } = z.string().uuid().safeParse(params.postId);

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
