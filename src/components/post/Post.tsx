"use client";

import { notFound } from "next/navigation";

import { User } from "@clerk/nextjs/server";
import { useSuspenseQuery } from "@tanstack/react-query";

import PostContextProvider from "@/context/PostContext";
import { useTRPC } from "@/trpc/client";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

export default function Post({
  currentUserId,
  postId,
}: {
  currentUserId: User["id"] | null;
  postId: string;
}) {
  const trpc = useTRPC();

  const { data: post } = useSuspenseQuery(
    trpc.post.getPost.queryOptions(postId),
  );

  if (!post) notFound();

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
      <div className="bg-card flex flex-col gap-2 rounded-lg border px-4 py-2">
        <PostHeader currentUserId={currentUserId} />
        <PostBody />
        <PostFooter currentUserId={currentUserId} />
      </div>
    </PostContextProvider>
  );
}
