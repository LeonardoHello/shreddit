import { notFound } from "next/navigation";

import { z } from "zod";

import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string; sort: string }>;
}) {
  const params = await props.params;

  const { data: sort, success } = z.nativeEnum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  void trpc.postFeed.getUpvotedPosts.prefetchInfinite({
    sort,
    username: params.username,
  });

  return <HydrateClient>{props.children}</HydrateClient>;
}
