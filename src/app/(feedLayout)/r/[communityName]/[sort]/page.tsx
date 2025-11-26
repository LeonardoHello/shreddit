import * as v from "valibot";

import { getSession } from "@/app/actions";
import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostFeed, PostSort } from "@/types/enums";

export default async function CommunityPage(
  props: PageProps<"/r/[communityName]/[sort]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  const sort = v.parse(v.enum(PostSort), params.sort);

  return (
    <FeedPostInfiniteQuery<PostFeed.COMMUNITY>
      params={{
        feed: PostFeed.COMMUNITY,
        communityName: params.communityName,
        currentUserId: session && session.session.userId,
        queryKey: ["communities", params.communityName, "posts", sort],
      }}
      sort={sort}
    />
  );
}
