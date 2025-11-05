import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={session && session.session.userId}
      infiniteQueryOptions={{
        procedure: "getUserPosts",
        input: {
          sort,
          username: params.username,
        },
      }}
    />
  );
}
