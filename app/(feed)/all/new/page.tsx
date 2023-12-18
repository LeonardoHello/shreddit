import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getAllNewPosts } from "@/lib/api/posts";
import { type QueryInfo, SortPostsBy } from "@/lib/types";

export default async function AllPageNew() {
  const { userId } = auth();

  const posts = await getAllNewPosts.execute({ offset: 0 });

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sortBy: SortPostsBy.NEW },
  };

  return (
    <Posts<"getAllPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
