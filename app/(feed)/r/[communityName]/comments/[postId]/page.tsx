import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import Comment from "@/components/Comment";
import CommentEditor from "@/components/CommentEditor";
import Post from "@/components/Post";
import { getPostById } from "@/lib/api/getPost";
import { getUserById } from "@/lib/api/getUser";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function PostPage({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const { userId } = auth();

  const [user, post] = await Promise.all([
    getUserById.execute({ currentUserId: userId }),
    getPostById.execute({ postId }),
  ]).catch(() => {
    throw new Error("There was a problem with loading post information.");
  });

  if (!post) notFound();

  return (
    <main className="flex grow flex-col items-center bg-zinc-900">
      <div className="flex w-full max-w-7xl grow flex-col items-center bg-black p-4">
        <div className="flex w-full max-w-5xl gap-4 rounded bg-zinc-900 p-2">
          <Post currentUserId={user ? user.id : null} initialData={post} />
        </div>
        <div className="flex w-full max-w-5xl flex-col gap-6 bg-zinc-900 px-14 py-4">
          {user && (
            <div>
              <div className="mb-2 text-xs">
                Comment as{" "}
                <Link
                  href={`/u/${user.name}`}
                  className="text-sky-500 hover:underline"
                >
                  {user.name}
                </Link>
              </div>
              <CommentEditor postId={post.id} />
            </div>
          )}
          <hr className="border-zinc-700/70" />
          {post.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </main>
  );
}
