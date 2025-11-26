import * as v from "valibot";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/hidden/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = v.parse(v.enum(PostSort), params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.HIDDEN>
      params={{
        feed: PostFeed.HIDDEN,
        username: params.username,
        currentUserId: session && session.session.userId,
        queryKey: ["users", params.username, "posts", PostFeed.HIDDEN, sort],
      }}
      sort={sort}
    />
  );
}
