"use client";

import { useRef } from "react";

import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import Post from "./Post";

export default function Posts({
  initialPosts,
}: {
  initialPosts: RouterOutput["joinedCommunitiesPosts"];
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    trpc.joinedCommunitiesPosts.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialPosts], pageParams: [0] },
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    );

  // let options = {
  //   root: document.querySelector("#scrollArea"),
  //   rootMargin: "0px",
  //   threshold: 1.0,
  // };

  // let observer = new IntersectionObserver(callback, options);

  if (data === undefined) {
    throw new Error("Couldn't fetch posts");
  }

  return (
    <div className="flex flex-col gap-2.5">
      {data.pages.map((page, pageIndex, pageArray) =>
        page.posts.map((post, postIndex, postArray) => (
          <div
            key={post.id}
            onClick={() => {
              if (
                hasNextPage &&
                pageIndex + 1 === pageArray.length &&
                postIndex + 1 === postArray.length
              ) {
                fetchNextPage();
              }
            }}
          >
            <Post post={post} />
          </div>
        )),
      )}
    </div>
  );
}
