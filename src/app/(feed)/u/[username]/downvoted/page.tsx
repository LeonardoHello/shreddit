import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function DownvotedPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, searchParams, auth] = await Promise.all([
    props.params,
    props.searchParams,
    authPromise(),
  ]);

  const { data: sort = PostSort.BEST } = z
    .nativeEnum(PostSort)
    .safeParse(searchParams.sort);

  void trpc.postFeed.getDownvotedPosts.prefetchInfinite({
    sort,
    username: params.username,
  });

  return (
    <HydrateClient>
      <FeedPostInfiniteQuery
        currentUserId={auth.userId}
        infiniteQueryOptions={{
          procedure: "getDownvotedPosts",
          input: { sort, username: params.username },
        }}
      />
    </HydrateClient>
  );
}
