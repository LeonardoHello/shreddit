"use client";

import { memo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { Post, User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import type { RouterOutput } from "@/trpc/routers/_app";
import type { InfiniteQueryPostProcedure, QueryInfo } from "@/types";
import PostsInfiniteQueryLoading from "./InfiniteQueryPostsLoading";
import PostComponent from "./Post";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["infiniteQueryPosts"][T];
  queryInfo: QueryInfo<T>;
};

const InfiniteQueryCommunityPosts = memo(function InfiniteQueryCommunityPosts({
  currentUserId,
  initialPosts,
  queryInfo,
}: Props<"getCommunityPosts">) {
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = trpc[
    "infiniteQueryPosts"
  ][queryInfo.procedure].useInfiniteQuery(queryInfo.input, {
    // filter muted communities and hidden posts
    select: (data) => {
      if (!currentUserId) {
        return data;
      }

      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          posts: page.posts.filter(
            (post) =>
              !post.usersToPosts.some(
                (userToPost) =>
                  userToPost.hidden === true &&
                  userToPost.userId === currentUserId,
              ),
          ),
        })),
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialData: { pages: [initialPosts], pageParams: [0] },
    refetchOnWindowFocus: false,
  });

  if (data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  useEffect(() => {
    if (!targetRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        fetchNextPage();
      }
    });

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const removePostFromQuery = async (postId: Post["id"]) => {
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
        page.posts.map((post, postI, posts) => (
          <div
            key={post.id}
            ref={postI === posts.length - 1 ? targetRef : undefined}
            className="cursor-pointer rounded border border-zinc-700/70 hover:border-zinc-500"
            onClick={() =>
              router.push(`/r/${post.community.name}/comments/${post.id}`)
            }
          >
            <PostComponent
              currentUserId={currentUserId}
              initialData={post}
              removePostFromQuery={removePostFromQuery}
            />
          </div>
        )),
      )}
      {isFetchingNextPage && <PostsInfiniteQueryLoading />}
    </div>
  );
});

export default InfiniteQueryCommunityPosts;
