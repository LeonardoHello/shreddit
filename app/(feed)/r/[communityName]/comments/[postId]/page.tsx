import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import Post from "@/components/Post";
import { getPost } from "@/lib/api/getPost";

export const runtime = "edge";

export default async function PostPage({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const post = await getPost.execute({ postId });

  if (!post) notFound();

  const { userId } = auth();

  return (
    <div className="flex cursor-pointer gap-4 rounded bg-zinc-900 p-2">
      <Post currentUserId={userId} initialPost={post} />
    </div>
  );
}
