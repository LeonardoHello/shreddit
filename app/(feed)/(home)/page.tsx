import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getHomeBestPosts } from "@/lib/api/posts";
import { PostSortBy, type QueryInfo } from "@/lib/types";

export default async function HomePage() {
  const { userId } = auth();

  if (userId === null) throw new Error("Could not load users information.");

  const posts = await getHomeBestPosts.execute({
    userId,
    offset: 0,
  });

  let nextCursor: QueryInfo<"getHomePosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getHomePosts"> = {
    procedure: "getHomePosts",
    input: { sortBy: PostSortBy.BEST },
  };

  return (
    <Posts<"getHomePosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
