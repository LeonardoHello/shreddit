"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import PostContextProvider from "@/context/PostContext";
import type { Post as PostSchema, User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import type { RouterOutput } from "@/trpc/routers/_app";
import type { InfiniteQueryPostProcedure, QueryInfo } from "@/types";
import Post from "../post/Post";
import PostsInfiniteQueryLoading from "./InfiniteQueryPostsLoading";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["infiniteQueryPosts"][T];
  queryInfo: QueryInfo<T>;
};

export default function InfiniteQueryCommunityPosts({
  currentUserId,
  initialPosts,
  queryInfo,
}: Props<"getCommunityPosts">) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = trpc[
    "infiniteQueryPosts"
  ][queryInfo.procedure].useInfiniteQuery(queryInfo.input, {
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

  const removePostFromQuery = async (postId: PostSchema["id"]) => {
    await utils["infiniteQueryPosts"][queryInfo.procedure].cancel();

    utils["infiniteQueryPosts"][queryInfo.procedure].setInfiniteData(
      queryInfo.input,
      (data) => {
        if (!data) {
          toast.error("Oops, it seemes that data can't be loaded.");

          return {
            pages: [],
            pageParams: [],
          };
        }

        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post.id !== postId),
          })),
        };
      },
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      {data.pages.map((page) =>
        page.posts.map((post) => (
          <div
            key={post.id}
            className="cursor-pointer rounded border border-zinc-700/70 hover:border-zinc-500"
            onClick={() =>
              router.push(`/r/${post.community.name}/comments/${post.id}`)
            }
          >
            <PostContextProvider post={post}>
              <Post
                currentUserId={currentUserId}
                removePostFromQuery={removePostFromQuery}
              />
            </PostContextProvider>
          </div>
        )),
      )}
      {isFetchingNextPage && <PostsInfiniteQueryLoading />}
      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
