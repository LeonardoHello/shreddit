import { z } from "zod/v4";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types/enums";

export default async function HomeSortPage(props: PageProps<"/home/[sort]">) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  if (!session) throw new Error("Could not load home page information.");

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={session.session.userId}
      infiniteQueryOptions={{
        procedure: "getHomePosts",
        input: { sort },
      }}
    />
  );
}
