import { auth } from "@clerk/nextjs";

import Posts from "@/components/Posts";
import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/lib/api/getPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export default async function AllPage({
  searchParams: { sort },
}: {
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getAllHotPosts.execute({
        offset: 0,
      });
      break;

    case SortPosts.NEW:
      posts = await getAllNewPosts.execute({
        offset: 0,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getAllControversialPosts.execute({
        offset: 0,
      });
      break;

    default:
      posts = await getAllBestPosts.execute({
        offset: 0,
      });
      break;
  }

  let nextCursor: QueryInfo<"getAllPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getAllPosts"> = {
    procedure: "getAllPosts",
    input: { sort },
  };

  return (
    <Posts<"getAllPosts">
      currentUserId={userId}
      initialPosts={{ posts, nextCursor }}
      queryInfo={queryInfo}
    />
  );
}
