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
      params={{
        feed: PostFeed.USER,
        username: params.username,
        currentUserId: session && session.session.userId,
        queryKey: ["users", params.username, "posts", sort],
      }}
      sort={sort}
    />
  );
}
