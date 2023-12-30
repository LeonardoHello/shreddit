"use client";

import { useRouter } from "next/navigation";

import type { User } from "@/lib/db/schema";
import type { InfiniteQueryPostProcedure, QueryInfo } from "@/lib/types";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import Post from "./Post";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: User["id"] | null;
  initialPosts: RouterOutput["infiniteQueryPosts"][T];
  queryInfo: QueryInfo<T>;
};

export default function InfiniteQueryPosts<
  T extends InfiniteQueryPostProcedure,
>({ currentUserId, initialPosts, queryInfo }: Props<T>) {
  const router = useRouter();

  const infiniteQuery = trpc.infiniteQueryPosts[
    queryInfo.procedure
  ].useInfiniteQuery(queryInfo.input, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialData: { pages: [initialPosts], pageParams: [0] },
    refetchOnWindowFocus: false,
  });

  if (infiniteQuery.data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  return (
    <div className="flex flex-col gap-2.5">
      {infiniteQuery.data.pages.map((page) =>
        page.posts.map((post) => (
          <div
            key={post.id}
            className="cursor-pointer rounded border border-zinc-700/70 hover:border-zinc-500"
            onClick={() =>
              router.push(`/r/${post.community.name}/comments/${post.id}`)
            }
          >
            <Post postData={post} currentUserId={currentUserId} />
          </div>
        )),
      )}
    </div>
  );
}
