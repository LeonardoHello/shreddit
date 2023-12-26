import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getUserBestPosts,
  getUserControversialPosts,
  getUserHotPosts,
  getUserNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function UserUpvotedPage({
  params: { userName },
  searchParams: { sort },
}: {
  params: { userName: string };
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getUserHotPosts.execute({
        offset: 0,
        userName,
      });
      break;

    case SortPosts.NEW:
      posts = await getUserNewPosts.execute({
        offset: 0,
        userName,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getUserControversialPosts.execute({
        offset: 0,
        userName,
      });
      break;

    default:
      posts = await getUserBestPosts.execute({
        offset: 0,
        userName,
      });
      break;
  }

  let nextCursor: QueryInfo<"getUserPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: { userName, sort },
  };

  return (
    <Posts<"getUserPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
