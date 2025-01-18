import { notFound } from "next/navigation";

import { currentUser as currentUserPromise } from "@clerk/nextjs/server";
import { z } from "zod";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types";

export default async function DownvotedPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    currentUserPromise(),
  ]);

  if (currentUser && currentUser.username !== params.username) notFound();

  const { data: sort = PostSort.BEST } = z
    .nativeEnum(PostSort)
    .safeParse(searchParams.sort);

  return (
    <FeedPostInfiniteQuery
      currentUserId={currentUser && currentUser.id}
      infiniteQueryOptions={{
        procedure: "getDownvotedPosts",
        input: { sort },
      }}
    />
  );
}
