import { notFound } from "next/navigation";

import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, searchParams, auth] = await Promise.all([
    props.params,
    props.searchParams,
    authPromise(),
  ]);

  const user = await trpc.user.getUserByName(params.username);

  if (!user) notFound();

  const { data: sort = PostSort.BEST } = z
    .nativeEnum(PostSort)
    .safeParse(searchParams.sort);

  void trpc.postFeed.getUserPosts.prefetchInfinite({
    sort,
    userId: user.id,
  });

  return (
    <HydrateClient>
      <FeedPostInfiniteQuery
        currentUserId={auth.userId}
        infiniteQueryOptions={{
          procedure: "getUserPosts",
          input: {
            sort,
            userId: user.id,
          },
        }}
      />
    </HydrateClient>
  );
}
