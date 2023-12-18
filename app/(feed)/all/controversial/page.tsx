import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getAllControversialPosts } from "@/lib/api/posts";
import { PostSortBy, type QueryInfo } from "@/lib/types";

export default async function AllPageControversial() {
  const { userId } = auth();

  const posts = await getAllControversialPosts.execute({ offset: 0 });

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sortBy: PostSortBy.CONTROVERSIAL },
  };

  return (
    <Posts<"getAllPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
