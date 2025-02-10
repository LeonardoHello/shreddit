import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types/enums";

export default async function UserPage(props: {
  params: Promise<{ username: string; sort: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  const sort = z.nativeEnum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={auth.userId}
      infiniteQueryOptions={{
        procedure: "getUpvotedPosts",
        input: {
          sort,
          username: params.username,
        },
      }}
    />
  );
}
