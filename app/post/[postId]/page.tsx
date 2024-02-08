import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import RTEComment from "@/components/RTE/RTEComment";
import Comments from "@/components/comment/Comments";
import Post from "@/components/post/Post";
import { getComments } from "@/lib/api/getComment";
import { getPostById } from "@/lib/api/getPost";
import { getUserById } from "@/lib/api/getUser";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function PostPage({
  params: { postId },
  searchParams,
}: {
  params: { postId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  const [user, post, comments] = await Promise.all([
    getUserById.execute({ currentUserId: userId }),
    getPostById.execute({ postId }),
    getComments.execute({ postId }),
  ]).catch((err) => {
    throw new Error(err);
  });

  if (!post) notFound();

  return (
    <main className="flex grow flex-col items-center bg-zinc-900">
      <div className="flex w-full max-w-7xl grow flex-col items-center bg-zinc-950 px-2 py-6 md:pb-12 md:pt-4">
        <div className="flex w-full max-w-5xl grow flex-col bg-zinc-900">
          <div className="flex gap-4 rounded p-2">
            <Post
              currentUserId={userId}
              initialData={post}
              initialEdit={searchParams.edit === "true"}
            />
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
            <RTEComment postId={post.id} />
          </div>
          <hr className="mx-14 my-2 border-zinc-700/70" />
          <div className="flex grow flex-col gap-6 bg-zinc-900 p-4">
            <Comments
              comments={comments.filter((comment) => !comment.parentCommentId)}
              replies={comments.filter((comment) => comment.parentCommentId)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
