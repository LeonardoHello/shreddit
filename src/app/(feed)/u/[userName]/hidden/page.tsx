import { notFound } from "next/navigation";

import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import { PostSort } from "@/types";

export default async function HiddenPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    currentUserPromise(),
  ]);

  if (currentUser && currentUser.username !== params.username) notFound();

  return (
    <FeedPostInfiniteQuery
      key={searchParams.sort}
      currentUserId={currentUser && currentUser.id}
      infiniteQueryOptions={{
        procedure: "getHiddenPosts",
        input: {
          sort: searchParams.sort,
        },
      }}
    />
  );
}
