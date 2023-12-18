import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getAllHotPosts } from "@/lib/api/posts";
import { type QueryInfo, SortPostsBy } from "@/lib/types";

export default async function AllPageHot() {
  const { userId } = auth();

  const posts = await getAllHotPosts.execute({ offset: 0 });

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sortBy: SortPostsBy.HOT },
  };

  return (
    <Posts<"getAllPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
