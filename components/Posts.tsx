"use client";

import type { User } from "@/lib/db/schema";
import type { InfiniteQueryPostProcedure, QueryInfo } from "@/lib/types";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import PostActions from "./PostActions";
import PostContent from "./PostContent";
import PostMetadata from "./PostMetadata";
import PostOptions from "./PostOptions";
import PostVote from "./PostVote";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["infiniteQueryPosts"][T];
  queryInfo: QueryInfo<T>;
};

export default function Posts<T extends InfiniteQueryPostProcedure>({
  currentUserId,
  initialPosts,
  queryInfo,
}: Props<T>) {
  const infiniteQuery = trpc.infiniteQueryPosts[
    queryInfo.procedure
  ].useInfiniteQuery(queryInfo.input, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialData: { pages: [initialPosts], pageParams: [0] },
    initialDataUpdatedAt: Date.now() + 500,
    refetchOnWindowFocus: false,
  });

  if (infiniteQuery.data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  const onClick = () => {
    if (infiniteQuery.hasNextPage) {
      infiniteQuery.fetchNextPage();
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {infiniteQuery.data.pages.map((page) =>
        page.posts.map((post) => (
          <div
            key={post.id}
            onClick={onClick}
            className="flex cursor-pointer gap-4 rounded border border-zinc-700/70 bg-zinc-900 p-2 hover:border-zinc-500"
          >
            <PostVote
              currentUserId={currentUserId}
              postId={post.id}
              usersToPosts={post.usersToPosts}
              queryInfo={queryInfo}
            />
            <div className="flex grow flex-col gap-1.5">
              <PostMetadata post={post} />
              <PostContent post={post} />
              <PostActions currentUserId={currentUserId} post={post}>
                <PostOptions post={post} queryInfo={queryInfo} />
              </PostActions>
            </div>
          </div>
        )),
      )}
    </div>
  );
}
