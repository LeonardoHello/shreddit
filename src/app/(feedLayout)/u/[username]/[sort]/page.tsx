import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.USER>
      currentUserId={session && session.session.userId}
      params={{
        feed: PostFeed.USER,
        username: params.username,
        queryKey: ["posts", PostFeed.USER, params.username, sort],
      }}
      sort={sort}
    />
  );
}
