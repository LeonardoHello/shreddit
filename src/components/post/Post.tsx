import { notFound } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { getPostById } from "@/api/getPost";
import PostContextProvider from "@/context/PostContext";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

export default async function Post({
  currentUserId,
  postId,
}: {
  currentUserId: User["id"] | null;
  postId: string;
}) {
  const post = await getPostById.execute({
    currentUserId,
    postId,
  });

  if (!post) notFound();

  return (
    <PostContextProvider post={post}>
      <div className="flex flex-col gap-2 rounded border bg-card px-4 py-2">
        <PostHeader currentUserId={currentUserId} />

        <PostBody />

        <PostFooter currentUserId={currentUserId} />
      </div>
    </PostContextProvider>
  );
}
