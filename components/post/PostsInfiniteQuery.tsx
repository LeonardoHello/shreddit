"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { type Post as PostType, type User } from "@/lib/db/schema";
import type { InfiniteQueryPostProcedure, QueryInfo } from "@/lib/types";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import Post from "./Post";
import PostsInfiniteQueryEmpty from "./PostsInfiniteQueryEmpty";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["infiniteQueryPosts"][T];
  queryInfo: QueryInfo<T>;
  params: { userName?: string; communityName?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function PostsInfiniteQuery<
  T extends InfiniteQueryPostProcedure,
>({ currentUserId, initialPosts, queryInfo, params, searchParams }: Props<T>) {
  const router = useRouter();

  const targetRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.infiniteQueryPosts[queryInfo.procedure].useInfiniteQuery(
      queryInfo.input,
      {
        // filter muted communities and hidden posts
        select: (data) => {
          if (!currentUserId || searchParams.filter) {
            return data;
          }

          if (params.communityName) {
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
          }

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              posts: page.posts
                .filter(
                  (post) =>
                    !post.community.usersToCommunities.some(
                      (userToCommunity) =>
                        userToCommunity.muted &&
                        userToCommunity.userId === currentUserId,
                    ),
                )
                .filter(
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
      },
    );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;

      fetchNextPage();
      observer.unobserve(entry.target);
    });

    if (targetRef.current && hasNextPage && !isFetchingNextPage) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  if (data.pages[0].posts.length === 0)
    return (
      <PostsInfiniteQueryEmpty
        communityName={params.communityName}
        userName={params.userName}
        filter={searchParams.filter}
      />
    );

  const removePostFromQuery = async (postId: PostType["id"]) => {
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
            className="flex cursor-pointer gap-4 rounded border border-zinc-700/70 bg-zinc-900 p-2 hover:border-zinc-500"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            <Post
              currentUserId={currentUserId}
              initialData={post}
              removePostFromQuery={removePostFromQuery}
            />
          </div>
        )),
      )}
    </div>
  );
}
