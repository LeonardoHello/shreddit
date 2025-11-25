import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function HomeSortPage(props: PageProps<"/home/[sort]">) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  if (!session) throw new Error("Could not load home page information.");

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.HOME>
      params={{
        feed: PostFeed.HOME,
        currentUserId: session.session.userId,
        queryKey: ["users", "me", "posts", sort],
      }}
      sort={sort}
    />
  );
}
