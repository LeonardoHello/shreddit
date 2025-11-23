import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function AllSortPage(props: PageProps<"/all/[sort]">) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.ALL>
      currentUserId={session && session.session.userId}
      params={{ feed: PostFeed.ALL, queryKey: ["posts", PostFeed.ALL, sort] }}
      sort={sort}
    />
  );
}
