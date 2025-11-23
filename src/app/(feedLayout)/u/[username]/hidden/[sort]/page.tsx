import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/hidden/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.HIDDEN>
      currentUserId={session && session.session.userId}
      params={{
        feed: PostFeed.HIDDEN,
        username: params.username,
        queryKey: ["posts", PostFeed.HIDDEN, params.username, sort],
      }}
      sort={sort}
    />
  );
}
