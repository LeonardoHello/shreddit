"use client";

import { useEffect, useRef } from "react";

import PostContextProvider from "@/context/PostContext";
import type { User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { AppRouter, RouterInput } from "@/trpc/routers/_app";
import FeedEmpty from "./FeedEmpty";
import FeedPost from "./FeedPost";
import FeedPostInfiniteQuerySkeleton from "./FeedPostInfiniteQuerySkeleton";

type PostFeedProcedures = keyof AppRouter["postFeed"];

type InfiniteQueryOptions = {
  [P in PostFeedProcedures]: {
    procedure: P;
    input: RouterInput["postFeed"][P];
  };
}[PostFeedProcedures];

export default function FeedPostInfiniteQuery({
  currentUserId,
  infiniteQueryOptions,
}: {
  currentUserId: User["id"] | null;
  infiniteQueryOptions: InfiniteQueryOptions;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { procedure, input } = infiniteQueryOptions;

  const [{ pages }, { isFetchingNextPage, fetchNextPage, hasNextPage }] =
    // @ts-expect-error input is correctly inferred based on procedure
    trpc.postFeed[procedure].useSuspenseInfiniteQuery(input, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    });

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

  if (pages[0].posts.length === 0) {
    return <FeedEmpty />;
  }

  return (
    <div className="relative flex flex-col gap-2.5">
      {pages.map((page) =>
        page.posts.map((post) => (
          <PostContextProvider key={post.id} post={post}>
            <FeedPost currentUserId={currentUserId} />
          </PostContextProvider>
        )),
      )}
      {isFetchingNextPage && <FeedPostInfiniteQuerySkeleton />}
      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
