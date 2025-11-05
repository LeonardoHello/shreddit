import { z } from "zod/v4";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/saved/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={session && session.session.userId}
      infiniteQueryOptions={{
        procedure: "getSavedPosts",
        input: {
          sort,
          username: params.username,
        },
      }}
    />
  );
}
