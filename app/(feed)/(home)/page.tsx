import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getJoinedCommunitiesPosts } from "@/lib/api/posts";
import { RouterOutput } from "@/trpc/procedures";

export default async function HomePage() {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  const joinedCommunitiesPosts = await getJoinedCommunitiesPosts(
    userId,
  ).execute({ offset: 0 });

  let nextCursor: RouterOutput["joinedCommunitiesPosts"]["nextCursor"] = null;
  if (joinedCommunitiesPosts.length === 10) {
    nextCursor = 10;
  }

  return (
    <Posts
      initialPosts={{ posts: joinedCommunitiesPosts, nextCursor }}
      userId={userId}
    />
  );
}
