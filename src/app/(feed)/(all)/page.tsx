import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function AllPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [searchParams, auth] = await Promise.all([
    props.searchParams,
    authPromise(),
  ]);

  const { data: sort = PostSort.BEST } = z
    .nativeEnum(PostSort)
    .safeParse(searchParams.sort);

  void trpc.postFeed.getAllPosts.prefetchInfinite({ sort });

  return (
    <main className="container flex grow gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <HydrateClient>
        <FeedPostInfiniteQuery
          currentUserId={auth.userId}
          infiniteQueryOptions={{
            procedure: "getAllPosts",
            input: { sort },
          }}
        />
      </HydrateClient>

      <div className="hidden w-80 xl:block" />
    </main>
  );
}
