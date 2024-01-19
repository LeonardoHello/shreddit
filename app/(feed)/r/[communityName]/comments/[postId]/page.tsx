import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import CommentRTE from "@/components/CommentRTE";
import Comments from "@/components/Comments";
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
      <div className="flex w-full max-w-7xl grow flex-col items-center bg-zinc-950 px-2 py-4">
        <div className="flex w-full max-w-5xl grow flex-col bg-zinc-900">
          <div className="flex gap-4 rounded p-2">
            <Post currentUserId={user ? user.id : null} initialData={post} />
          </div>
          <div className="flex flex-col gap-2 p-4 px-14">
            <div className="text-xs">
              {user && (
                <>
                  Comment as{" "}
                  <Link
                    href={`/u/${user.name}`}
                    className="text-sky-500 hover:underline"
                  >
                    {user.name}
                  </Link>
                </>
              )}
            </div>
            <CommentRTE postId={post.id} />
          </div>
          <hr className="mx-14 my-2 border-zinc-700/70" />
          <div className="flex grow flex-col gap-6 bg-zinc-900 p-4">
            <Comments
              comments={post.comments.filter(
                (comment) => !comment.parentCommentId,
              )}
              replies={post.comments.filter(
                (comment) => comment.parentCommentId,
              )}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
