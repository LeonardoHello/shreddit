"use client";

import { useEffect, useRef } from "react";

import PostContextProvider from "@/context/PostContext";
import type { User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { AppRouter, RouterInput } from "@/trpc/routers/_app";
import FeedEmpty from "./FeedEmpty";
import FeedPost from "./FeedPost";
import FeedPostInfiniteQuerySkeleton from "./FeedPostInfiniteQuerySkeleton";
import FeedSort from "./FeedSort";

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

  let infiniteQuery;
  if (
    procedure === "getUserPosts" ||
    procedure === "getSavedPosts" ||
    procedure === "getHiddenPosts" ||
    procedure === "getUpvotedPosts" ||
    procedure === "getDownvotedPosts"
  ) {
    infiniteQuery = trpc.postFeed[procedure].useSuspenseInfiniteQuery(input, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  } else if (procedure === "getCommunityPosts") {
    infiniteQuery = trpc.postFeed[procedure].useSuspenseInfiniteQuery(input, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  } else {
    infiniteQuery = trpc.postFeed[procedure].useSuspenseInfiniteQuery(input, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  }

  const [{ pages }, { isFetchingNextPage, fetchNextPage, hasNextPage }] =
    infiniteQuery;

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
    return (
      <div className="flex grow flex-col gap-2">
        <FeedSort sort={input.sort} />
        <FeedEmpty />
      </div>
    );
  }

  return (
    <div className="relative flex w-0 grow flex-col gap-2">
      <FeedSort sort={input.sort} />

      {pages.map((page) =>
        page.posts.map((post) => (
          <PostContextProvider
            key={[
              post.id,
              post.updatedAt,
              post.userToPostUpdatedAt,
              post.commentCount,
            ].join("-")}
            post={post}
          >
            <FeedPost currentUserId={currentUserId} />
          </PostContextProvider>
        )),
      )}
      {isFetchingNextPage && <FeedPostInfiniteQuerySkeleton />}

      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
