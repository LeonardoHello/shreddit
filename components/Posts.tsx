"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";

import communityImage from "@/public/community-logo.svg";
import dot from "@/public/dot.svg";
import { trpc } from "@/trpc/client";
import { RouterOutput } from "@/trpc/server/procedures";

type Prop = {
  initialPosts: RouterOutput["joinedCommunitiesPosts"];
  communityIds: string[];
};

export default function Posts({ initialPosts, communityIds }: Prop) {
  const root = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    trpc.joinedCommunitiesPosts.useInfiniteQuery(
      { communityIds },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialPosts], pageParams: [0] },
        initialCursor: initialPosts.nextCursor,
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
    <div>
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          <div>
            {page.posts.map((post) => (
              <div key={post.communityId} className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {post.community.imageUrl ? (
                    <Image
                      src={post.community.imageUrl}
                      alt="community image"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src={communityImage}
                      alt="community image"
                      width={20}
                      height={20}
                      className="rounded-full border border-zinc-300 bg-zinc-300"
                    />
                  )}
                  <div className="text-xs font-bold">
                    r/{post.community.name}
                  </div>
                </div>
                <Image src={dot} alt="dot" height={2} width={2} />
                <div>Posted by {post.community.name}</div>
              </div>
            ))}
          </div>
        </Fragment>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage || hasNextPage === false}
      >
        load more
      </button>
    </div>
  );
}
