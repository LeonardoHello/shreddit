import { currentUser as currentUserPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    currentUserPromise(),
  ]);

  const { data: sort = PostSort.BEST } = z
    .nativeEnum(PostSort)
    .safeParse(searchParams.sort);

  void trpc.postFeed.getUserPosts.prefetchInfinite({
    sort,
    username: params.username,
  });

  return (
    <HydrateClient>
      <FeedPostInfiniteQuery
        currentUserId={currentUser && currentUser.id}
        infiniteQueryOptions={{
          procedure: "getUserPosts",
          input: {
            sort,
            username: params.username,
          },
        }}
      />
    </HydrateClient>
  );
}
