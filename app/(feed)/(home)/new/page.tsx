import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getHomeNewPosts } from "@/lib/api/posts";
import { type QueryInfo, SortPostsBy } from "@/lib/types";

export default async function HomePageNew() {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  const posts = await getHomeNewPosts.execute({
    userId,
    offset: 0,
  });

  let nextCursor: QueryInfo<"getHomePosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getHomePosts"> = {
    procedure: "getHomePosts",
    input: { sortBy: SortPostsBy.NEW },
  };

  return (
    <Posts<"getHomePosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
