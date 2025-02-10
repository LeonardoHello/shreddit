import { notFound } from "next/navigation";

import { z } from "zod";

import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types/enums";

export default async function HomeSortLayout(props: {
  children: React.ReactNode;
  params: Promise<{ sort: string }>;
}) {
  const params = await props.params;

  const { data: sort, success } = z.nativeEnum(PostSort).safeParse(params.sort);

  if (!success) notFound();

  void trpc.postFeed.getHomePosts.prefetchInfinite({ sort });

  return (
    <main className="container flex grow gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <HydrateClient>{props.children}</HydrateClient>
      <div className="hidden w-80 xl:block" />
    </main>
  );
}
