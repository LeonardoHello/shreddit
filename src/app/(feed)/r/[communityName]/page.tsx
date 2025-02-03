import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { HydrateClient, trpc } from "@/trpc/server";
import { PostSort } from "@/types";

export default async function CommunityPage(props: {
  params: Promise<{ communityName: string }>;
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

  void trpc.postFeed.getCommunityPosts.prefetchInfinite({
    sort,
    communityName: params.communityName,
  });

  return (
    <HydrateClient>
      <FeedPostInfiniteQuery
        currentUserId={auth.userId}
        infiniteQueryOptions={{
          procedure: "getCommunityPosts",
          input: {
            sort,
            communityName: params.communityName,
          },
        }}
      />
    </HydrateClient>
  );
}
