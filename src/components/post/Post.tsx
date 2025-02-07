"use client";

import { use } from "react";

import { User } from "@clerk/nextjs/server";

import PostContextProvider from "@/context/PostContext";
import { RouterOutput } from "@/trpc/routers/_app";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

export default function Post({
  currentUserId,
  postPromise,
}: {
  currentUserId: User["id"] | null;
  postPromise: Promise<RouterOutput["post"]["getPost"]>;
}) {
  const post = use(postPromise);

  return (
    <PostContextProvider
      key={[
        post.id,
        post.updatedAt,
        post.userToPostUpdatedAt,
        post.commentCount,
      ].join("-")}
      post={post}
    >
      <div className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-2">
        <PostHeader currentUserId={currentUserId} />
        <PostBody />
        <PostFooter currentUserId={currentUserId} />
      </div>
    </PostContextProvider>
  );
}
