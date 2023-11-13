"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import getRelativeTimeString from "@/lib/utils/getRelativeTimeString";
import communityImage from "@/public/community-logo.svg";
import dot from "@/public/dot.svg";
import { trpc } from "@/trpc/client";
import { RouterOutput } from "@/trpc/server/procedures";

import Vote from "./Vote";

type Prop = {
  initialPosts: RouterOutput["joinedCommunitiesPosts"];
  communityIds: string[];
};

export default function Posts({ initialPosts, communityIds }: Prop) {
  const root = useRef<HTMLDivElement>(null);
  const [imgUrls, setImgUrls] = useState(null);

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
    <div className="bg-zinc-900">
      {data.pages.map((page) =>
        page.posts.map((post) => (
          <div key={post.communityId} className="flex items-center gap-1">
            <Vote />
            <div className="text-xs">
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
                <div className="font-bold">r/{post.community.name}</div>
              </div>
              <Image src={dot} alt="dot" height={2} width={2} />
              <div className="text-zinc-500">
                Posted by {post.author ? post.author.name : "[deleted]"}{" "}
                {getRelativeTimeString(post.createdAt as unknown as Date)}
              </div>
            </div>
            <h2>{post.title}</h2>
            <input
              type="file"
              accept="image/jpeg, image/png, image/jpg, video/*"
              multiple
            />
          </div>
        )),
      )}
    </div>
  );
}
