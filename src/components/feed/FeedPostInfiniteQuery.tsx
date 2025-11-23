"use client";

import { useEffect, useRef } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import PostContextProvider from "@/context/PostContext";
import type { Community } from "@/db/schema/communities";
import type { User } from "@/db/schema/users";
import { client } from "@/hono/client";
import { PostFeed, PostSort } from "@/types/enums";
import FeedEmpty from "./FeedEmpty";
import FeedPost from "./FeedPost";
import FeedPostInfiniteQuerySkeleton from "./FeedPostInfiniteQuerySkeleton";
import FeedSort from "./FeedSort";

type InfiniteQueryParams<T extends PostFeed> = {
  [P in T]: P extends PostFeed.ALL
    ? { feed: P; queryKey: ["posts", P, PostSort] }
    : P extends PostFeed.HOME
      ? { feed: P; queryKey: ["posts", P, PostSort] }
      : P extends PostFeed.COMMUNITY
        ? {
            feed: P;
            queryKey: ["posts", P, Community["name"], PostSort];
            communityName: Community["name"];
          }
        : {
            feed: P;
            queryKey: ["posts", P, NonNullable<User["username"]>, PostSort];
            username: NonNullable<User["username"]>;
          };
}[T];

export default function FeedPostInfiniteQuery<T extends PostFeed>({
  currentUserId,
  params,
  sort,
  cursor,
}: {
  currentUserId: User["id"] | null;
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
            const homePosts = await client.posts.home.$get({
              query: { sort, cursor: pageParam },
            });
            return homePosts.json();

          case PostFeed.COMMUNITY:
            const communityPosts = await client.posts.communities[
              ":communityName"
            ].$get({
              param: { communityName: params.communityName },
              query: { sort, cursor: pageParam },
            });
            return communityPosts.json();

          case PostFeed.USER:
            const userPosts = await client.posts.users[":username"].$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return userPosts.json();

          case PostFeed.SAVED:
            const savedPosts = await client.posts.users[":username"].saved.$get(
              {
                param: { username: params.username },
                query: { sort, cursor: pageParam },
              },
            );
            return savedPosts.json();

          case PostFeed.HIDDEN:
            const hiddenPosts = await client.posts.users[
              ":username"
            ].hidden.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return hiddenPosts.json();

          case PostFeed.UPVOTED:
            const upvotedPosts = await client.posts.users[
              ":username"
            ].upvoted.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return upvotedPosts.json();

          case PostFeed.DOWNVOTED:
            const downvotedPosts = await client.posts.users[
              ":username"
            ].downvoted.$get({
              param: { username: params.username },
              query: { sort, cursor: pageParam },
            });
            return downvotedPosts.json();

          default:
          case PostFeed.ALL:
            const allPosts = await client.posts.all.$get({
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
            <FeedPost currentUserId={currentUserId} />
          </PostContextProvider>
        )),
      )}
      {isFetchingNextPage && <FeedPostInfiniteQuerySkeleton withoutButton />}

      <div ref={ref} className="sr-only bottom-0 h-[550px]" />
    </div>
  );
}
