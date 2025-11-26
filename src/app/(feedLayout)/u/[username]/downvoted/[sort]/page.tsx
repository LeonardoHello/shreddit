import * as v from "valibot";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/downvoted/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = v.parse(v.enum(PostSort), params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.DOWNVOTED>
      params={{
        feed: PostFeed.DOWNVOTED,
        username: params.username,
        currentUserId: session && session.session.userId,
        queryKey: ["users", params.username, "posts", PostFeed.DOWNVOTED, sort],
      }}
      sort={sort}
    />
  );
}
