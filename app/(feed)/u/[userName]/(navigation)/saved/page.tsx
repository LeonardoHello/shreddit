import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getSavedBestPosts,
  getSavedControversialPosts,
  getSavedHotPosts,
  getSavedNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function UserSavedPage({
  searchParams: { sort },
}: {
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getSavedHotPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.NEW:
      posts = await getSavedNewPosts.execute({
        offset: 0,
        userId,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getSavedControversialPosts.execute({
        offset: 0,
        userId,
      });
      break;

    default:
      posts = await getSavedBestPosts.execute({
        offset: 0,
        userId,
      });
      break;
  }

  let nextCursor: QueryInfo<"getSavedPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getSavedPosts"> = {
    procedure: "getSavedPosts",
    input: { sort },
  };

  return (
    <Posts<"getSavedPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
