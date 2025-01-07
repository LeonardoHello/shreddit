"use client";

import { useEffect, useRef } from "react";

import PostContextProvider from "@/context/PostContext";
import type { User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { AppRouter, RouterInput } from "@/trpc/routers/_app";
import FeedEmpty from "./FeedEmpty";
import FeedLoading from "./FeedLoading";
import FeedPost from "./FeedPost";

type PostFeedProcedures = keyof AppRouter["postFeed"];

type QueryInfo = {
  [P in PostFeedProcedures]: {
    procedure: P;
    input: RouterInput["postFeed"][P];
  };
}[PostFeedProcedures];

export default function FeedPostInfiniteQuery({
  currentUserId,
  queryInfo,
}: {
  currentUserId: User["id"] | null;
  queryInfo: QueryInfo;
}) {
  const ref = useRef<HTMLDivElement>(null);

  let infiniteQuery;

  switch (queryInfo.procedure) {
    case "getCommunityPosts":
      infiniteQuery = trpc.postFeed[queryInfo.procedure].useInfiniteQuery(
        queryInfo.input,
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          refetchOnWindowFocus: false,
        },
      );
      break;

    case "getUserPosts":
      infiniteQuery = trpc.postFeed[queryInfo.procedure].useInfiniteQuery(
        queryInfo.input,
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          refetchOnWindowFocus: false,
        },
      );
      break;

    default:
      infiniteQuery = trpc.postFeed[queryInfo.procedure].useInfiniteQuery(
        queryInfo.input,
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          refetchOnWindowFocus: false,
        },
      );
      break;
  }

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
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

  if (isLoading) {
    return <FeedLoading />;
  }

  if (data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  if (data.pages.length === 0) {
    return <FeedEmpty />;
  }

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
