"use client";

import { useEffect, useRef } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import PostContextProvider from "@/context/PostContext";
import type { User } from "@/db/schema/users";
import { useTRPC } from "@/trpc/client";
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

  const trpc = useTRPC();

  // not all procedures are using the same QueryOptions
  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery(
    procedure === "getAllPosts" || procedure === "getHomePosts"
      ? trpc.postFeed[procedure].infiniteQueryOptions(input, {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
      : procedure === "getCommunityPosts"
        ? trpc.postFeed[procedure].infiniteQueryOptions(input, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          })
        : trpc.postFeed[procedure].infiniteQueryOptions(input, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          }),
  );

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
        <FeedSort sort={infiniteQueryOptions.input.sort} />
        <FeedEmpty />
      </div>
    );
  }

  return (
    <div className="relative flex w-0 grow flex-col gap-2">
      <FeedSort sort={infiniteQueryOptions.input.sort} />

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
      {isFetchingNextPage && <FeedPostInfiniteQuerySkeleton withoutButton />}

      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
