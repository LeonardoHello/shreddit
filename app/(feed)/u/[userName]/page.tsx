import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getUserBestPosts } from "@/lib/api/posts";
import { type QueryInfo, SortPostsBy } from "@/lib/types";

export default async function UserPage({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const { userId } = auth();

  const posts = await getUserBestPosts.execute({
    offset: 0,
    userName,
  });

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: { sortBy: SortPostsBy.BEST, userName },
  };

  return (
    <Posts<"getUserPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
