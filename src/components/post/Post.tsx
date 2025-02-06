"use client";

import { notFound } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import PostContextProvider from "@/context/PostContext";
import { trpc } from "@/trpc/client";
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
  const [post] = trpc.post.getPost.useSuspenseQuery(postId);

  if (!post) notFound();

  return (
    <PostContextProvider
      key={[post.id, post.updatedAt, post.userToPostUpdatedAt].join("-")}
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
