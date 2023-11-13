import { redirect } from "next/navigation";

import Posts from "@/components/Posts";
import Sort from "@/components/Sort";
import {
  getJoinedCommunitiesIds,
  getJoinedCommunitiesPosts,
} from "@/lib/api/getJoinedCommunitiesPosts";
import { auth } from "@clerk/nextjs";

export default async function HomePage() {
  const { userId } = auth();

  if (userId === null) {
    redirect("/all");
  }

  const joinedCommunitiesIds = await getJoinedCommunitiesIds(userId);

  const communityIdList = joinedCommunitiesIds.map(
    (community) => community.communityId,
  );

  // added a random uuid so it doesn't throw error if empty
  communityIdList.push("177fc47b-4f50-4d93-83c0-ea801c9d8530");

  const joinedCommunitiesPosts = await getJoinedCommunitiesPosts(
    communityIdList,
  ).execute({ offset: 0 });

  let nextCursor = null;

  // since limit is set to 10, setting nextCursor (offset) to 10 to fetch next 10 posts after first 10 initially fetched posts
  if (joinedCommunitiesPosts.length === 10) {
    nextCursor = 10;
  }

  return (
    <main>
      <Sort />
      <Posts
        // @ts-expect-error -> createdAt's type 'Date' is not assignable to type 'string'
        initialPosts={{ posts: joinedCommunitiesPosts, nextCursor }}
        communityIds={communityIdList}
      />
    </main>
  );
}
