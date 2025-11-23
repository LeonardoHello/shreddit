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
      currentUserId={session && session.session.userId}
      params={{ feed: PostFeed.HOME, queryKey: ["posts", PostFeed.HOME, sort] }}
      sort={sort}
    />
  );
}
