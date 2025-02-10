import { auth as authPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types/enums";

export default async function HomeSortPage(props: {
  params: Promise<{ sort: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  if (auth.userId === null)
    throw new Error("Could not load home page information.");

  const sort = z.nativeEnum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={auth.userId}
      infiniteQueryOptions={{
        procedure: "getHomePosts",
        input: { sort },
      }}
    />
  );
}
