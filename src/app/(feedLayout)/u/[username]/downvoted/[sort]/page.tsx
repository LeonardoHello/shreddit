import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/downvoted/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.DOWNVOTED>
      currentUserId={session && session.session.userId}
      params={{
        feed: PostFeed.DOWNVOTED,
        username: params.username,
        queryKey: ["posts", PostFeed.DOWNVOTED, params.username, sort],
      }}
      sort={sort}
    />
  );
}
