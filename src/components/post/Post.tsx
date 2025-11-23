"use client";

import { notFound } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import PostContextProvider from "@/context/PostContext";
import { User } from "@/db/schema/users";
import { client } from "@/hono/client";
import { uuidv4PathRegex as reg } from "@/utils/hono";
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
  const { data: post } = useSuspenseQuery({
    queryKey: ["posts", postId],
    queryFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].$get({
        param: { postId },
      });

      return res.json();
    },
  });

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
