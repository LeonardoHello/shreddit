"use client";

import { useEffect, useRef } from "react";

import PostContextProvider from "@/context/PostContext";
import type { User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import type { RouterOutput } from "@/trpc/routers/_app";
import type { PostFeedProcedures, QueryInfo } from "@/types";
import FeedLoading from "./FeedLoading";
import FeedPost from "./FeedPost";

type Props<T extends PostFeedProcedures> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["postFeed"][T];
  queryInfo: QueryInfo<T>;
};

export default function FeedUpvotedPosts({
  currentUserId,
  initialPosts,
  queryInfo,
}: Props<"getUpvotedPosts">) {
  const ref = useRef<HTMLDivElement>(null);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.postFeed[queryInfo.procedure].useInfiniteQuery(queryInfo.input, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialPosts], pageParams: [0] },
      refetchOnWindowFocus: false,
    });

  if (data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  useEffect(() => {
    if (!ref.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="relative flex flex-col gap-2.5">
      {data.pages.map((page) =>
        page.posts.map((post) => (
          <PostContextProvider key={post.id} post={post}>
            <FeedPost currentUserId={currentUserId} />
          </PostContextProvider>
        )),
      )}
      {isFetchingNextPage && <FeedLoading />}
      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
