import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod/v4";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types/enums";

export default async function UserPage(props: {
  params: Promise<{ username: string; sort: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={auth.userId}
      infiniteQueryOptions={{
        procedure: "getDownvotedPosts",
        input: {
          sort,
          username: params.username,
        },
      }}
    />
  );
}
