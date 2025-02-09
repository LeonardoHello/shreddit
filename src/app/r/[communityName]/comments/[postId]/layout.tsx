import { notFound } from "next/navigation";

import { z } from "zod";

import { HydrateClient, trpc } from "@/trpc/server";

export default async function PostLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string; postId: string }>;
}) {
  const params = await props.params;

  const { success } = z.string().uuid().safeParse(params.postId);

  if (!success) notFound();

  void trpc.post.getPost.prefetch(params.postId);
  void trpc.comment.getComments.prefetch(params.postId);

  return <HydrateClient>{props.children}</HydrateClient>;
}
