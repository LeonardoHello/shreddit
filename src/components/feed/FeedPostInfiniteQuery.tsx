"use client";

import { useEffect, useRef } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import PostContextProvider from "@/context/PostContext";
import type { Community } from "@/db/schema/communities";
import type { User } from "@/db/schema/users";
import { client } from "@/hono/client";
import type { UserId } from "@/lib/auth";
import { PostFeed, PostSort } from "@/types/enums";
import FeedEmpty from "./FeedEmpty";
import FeedPost from "./FeedPost";
import FeedPostInfiniteQuerySkeleton from "./FeedPostInfiniteQuerySkeleton";
import FeedSort from "./FeedSort";

type InfiniteQueryParams<T extends PostFeed> = {
  [P in T]: P extends PostFeed.ALL
    ? {
        feed: P;
        currentUserId: UserId;
        queryKey: ["posts", PostSort];
      }
    : P extends PostFeed.HOME
      ? {
          feed: P;
          currentUserId: NonNullable<UserId>;
          queryKey: ["users", "me", "posts", PostSort];
        }
      : P extends PostFeed.COMMUNITY
        ? {
            feed: P;
            currentUserId: UserId;
            queryKey: ["communities", Community["name"], "posts", PostSort];
            communityName: Community["name"];
          }
        : P extends PostFeed.USER
          ? {
              feed: P;
              currentUserId: UserId;
              queryKey: [
                "users",
                NonNullable<User["username"]>,
                "posts",
                PostSort,
              ];
              username: NonNullable<User["username"]>;
            }
          : {
              feed: P;
              currentUserId: UserId;
              queryKey: [
                "users",
                NonNullable<User["username"]>,
                "posts",
                P,
                PostSort,
              ];
              username: NonNullable<User["username"]>;
            };
}[T];

export default function FeedPostInfiniteQuery<T extends PostFeed>({
  params,
  sort,
  cursor,
}: {
  params: InfiniteQueryParams<T>;
  sort: PostSort;
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { queryKey } = params;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn: async ({ pageParam }) => {
        switch (params.feed) {
          case PostFeed.HOME:
            const homePosts = await client.users.me.posts.$get({
              query: { sort, cursor: pageParam },
            });
            return homePosts.json();

          case PostFeed.COMMUNITY:
            const communityPosts = await client.communities[
              ":communityName"
            ].posts.$get({
              param: { communityName: params.communityName },
              query: { sort, cursor: pageParam },
            });
            return communityPosts.json();

          case PostFeed.USER:
            const userPosts = await client.users[":username"].posts.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return userPosts.json();

          case PostFeed.SAVED:
            const savedPosts = await client.users[":username"].posts.saved.$get(
              {
                param: { username: params.username },
                query: { sort, cursor: pageParam },
              },
            );
            return savedPosts.json();

          case PostFeed.HIDDEN:
            const hiddenPosts = await client.users[
              ":username"
            ].posts.hidden.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return hiddenPosts.json();

          case PostFeed.UPVOTED:
            const upvotedPosts = await client.users[
              ":username"
            ].posts.upvoted.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return upvotedPosts.json();

          case PostFeed.DOWNVOTED:
            const downvotedPosts = await client.users[
              ":username"
            ].posts.downvoted.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return downvotedPosts.json();

          default:
          case PostFeed.ALL:
            const allPosts = await client.posts.$get({
              query: { sort, cursor: pageParam },
            });
            return allPosts.json();
        }
      },
      // determens the type of queryFn's pageParam
      initialPageParam: cursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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

  if (data.pages[0].posts.length === 0) {
    return (
      <div className="flex grow flex-col gap-2">
        <FeedSort sort={sort} />
        <FeedEmpty />
      </div>
    );
  }

  return (
    <div className="relative flex w-0 grow flex-col gap-2">
      <FeedSort sort={sort} />

      {data.pages.map((page) =>
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
            <FeedPost currentUserId={params.currentUserId} />
          </PostContextProvider>
        )),
      )}
      {isFetchingNextPage && <FeedPostInfiniteQuerySkeleton withoutButton />}

      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
