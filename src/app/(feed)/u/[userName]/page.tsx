import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import FeedPostInfiniteQuery from "@/components/feed/FeedPostInfiniteQuery";
import FeedSort from "@/components/feed/FeedSort";
import { PostSort } from "@/types";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    // currentUser function is deduped from layout
    currentUserPromise(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <FeedSort />
      </div>

      <FeedPostInfiniteQuery
        key={searchParams.sort}
        currentUserId={currentUser && currentUser.id}
        queryInfo={{
          procedure: "getUserPosts",
          input: {
            sort: searchParams.sort,
            username: params.username,
          },
        }}
      />
    </>
  );
}
