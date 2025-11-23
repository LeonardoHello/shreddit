import * as z from "zod/mini";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function CommunityPage(
  props: PageProps<"/r/[communityName]/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = z.enum(PostSort).parse(params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.COMMUNITY>
      currentUserId={session && session.session.userId}
      params={{
        feed: PostFeed.COMMUNITY,
        queryKey: ["posts", PostFeed.COMMUNITY, params.communityName, sort],
        communityName: params.communityName,
      }}
      sort={sort}
    />
  );
}
