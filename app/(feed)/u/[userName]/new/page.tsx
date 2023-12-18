import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import { getUserNewPosts } from "@/lib/api/posts";
import { PostSortBy, type QueryInfo } from "@/lib/types";

export default async function UserPageNew({
  params: { userName },
}: {
  params: { userName: string };
}) {
  const { userId } = auth();

  const posts = await getUserNewPosts.execute({
    offset: 0,
    userName,
  });

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: { sortBy: PostSortBy.NEW, userName },
  };

  return (
    <Posts<"getUserPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
