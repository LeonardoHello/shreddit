"use client";

import { memo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { Community, Post, User } from "@/db/schema";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";
import type { InfiniteQueryPostProcedure, QueryInfo } from "@/types";
import PostComponent from "./Post";
import PostsInfiniteQueryEmpty from "./PostsInfiniteQueryEmpty";
import PostsInfiniteQueryLoading from "./PostsInfiniteQueryLoading";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["infiniteQueryPosts"][T];
  queryInfo: QueryInfo<T>;
  params: { userName?: User["name"]; communityName?: Community["name"] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default memo(function PostsInfiniteQuery<
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

  if (data.pages[0].posts.length === 0)
    return (
      <PostsInfiniteQueryEmpty params={params} searchParams={searchParams} />
    );

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
