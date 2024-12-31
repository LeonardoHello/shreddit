import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import FeedEmpty from "@/components/feed/FeedEmpty";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import FeedUserPosts from "@/components/feed/FeedUserPosts";
import { trpc } from "@/trpc/server";
import { PostSort, QueryInfo } from "@/types";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ sort?: PostSort }>;
}) {
  const [params, searchParams, currentUser] = await Promise.all([
    props.params,
    props.searchParams,
    currentUserPromise(),
  ]);

  const infiniteQueryPosts = await trpc.postFeed.getUserPosts({
    sort: searchParams.sort,
    username: params.username,
  });

  const queryInfo: QueryInfo<"getUserPosts"> = {
    procedure: "getUserPosts",
    input: {
      cursor: infiniteQueryPosts.nextCursor,
      sort: searchParams.sort,
      username: params.username,
    },
  };

  if (infiniteQueryPosts.posts.length === 0) {
    return <FeedEmpty params={params} />;
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {currentUser && currentUser.username === params.username && (
          <FeedInput
            username={currentUser.username}
            imageUrl={currentUser.imageUrl}
          />
        )}
        <FeedSort />
      </div>

      {infiniteQueryPosts.posts.length === 0 ? (
        <FeedEmpty params={params} />
      ) : (
        <FeedUserPosts
          key={searchParams.sort}
          currentUserId={currentUser && currentUser.id}
          initialPosts={infiniteQueryPosts}
          queryInfo={queryInfo}
        />
      )}
    </>
  );
}
