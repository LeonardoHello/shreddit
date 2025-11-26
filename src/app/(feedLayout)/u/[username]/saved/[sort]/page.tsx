import * as v from "valibot";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function UserPage(
  props: PageProps<"/u/[username]/saved/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = v.parse(v.enum(PostSort), params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.SAVED>
      params={{
        feed: PostFeed.SAVED,
        username: params.username,
        currentUserId: session && session.session.userId,
        queryKey: ["users", params.username, "posts", PostFeed.SAVED, sort],
      }}
      sort={sort}
    />
  );
}
