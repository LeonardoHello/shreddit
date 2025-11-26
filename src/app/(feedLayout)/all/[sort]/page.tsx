import * as v from "valibot";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function AllSortPage(props: PageProps<"/all/[sort]">) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = v.parse(v.enum(PostSort), params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.ALL>
      params={{
        feed: PostFeed.ALL,
        currentUserId: session && session.session.userId,
        queryKey: ["posts", sort],
      }}
      sort={sort}
    />
  );
}
