import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getHomeControversialPosts } from "@/lib/api/getPosts";
import { type QueryInfo, SortPostsBy } from "@/lib/types";

export default async function HomePageControversial() {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  const posts = await getHomeControversialPosts.execute({
    userId,
    offset: 0,
  });

  let nextCursor: QueryInfo<"getHomePosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getHomePosts"> = {
    procedure: "getHomePosts",
    input: { sortBy: SortPostsBy.CONTROVERSIAL },
  };

  return (
    <Posts<"getHomePosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
