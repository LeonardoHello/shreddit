import { notFound } from "next/navigation";

import { z } from "zod";

import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types/enums";

export default async function AllSortLayout(props: {
  children: React.ReactNode;
  params: Promise<{ sort: string }>;
}) {
  const params = await props.params;

  const { data: sort, success } = z.nativeEnum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  void trpc.postFeed.getAllPosts.prefetchInfinite({ sort });

  return (
    <div className="container flex grow gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <HydrateClient>{props.children}</HydrateClient>
      <div className="hidden w-80 xl:block" />
    </div>
  );
}
