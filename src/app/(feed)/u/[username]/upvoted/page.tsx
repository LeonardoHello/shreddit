import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types";

export default async function UpvotedPage(props: {
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

  return (
    <FeedPostInfiniteQuery
      currentUserId={auth.userId}
      infiniteQueryOptions={{
        procedure: "getUpvotedPosts",
        input: { sort, username: params.username },
      }}
    />
  );
}
