import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getComments } from "@/api/getComment";
import { getPostById } from "@/api/getPost";
import { getUserById } from "@/api/getUser";
import Comments from "@/components/comment/Comments";
import Post from "@/components/post/Post";
import RTEComment from "@/components/RTE/RTEComment";

export default async function PostPage(props: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { userId } = await auth();

  const [user, post, comments] = await Promise.all([
    getUserById.execute({ currentUserId: userId }),
    getPostById.execute({ postId: params.postId }),
    getComments.execute({ postId: params.postId }),
  ]).catch((err) => {
    throw new Error(err);
  });

  if (!post) notFound();

  return (
    <div className="-order-1 row-span-2 bg-zinc-900">
      <Post
        currentUserId={userId}
        initialData={post}
        initialEdit={searchParams.edit === "true"}
      />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <div className="flex flex-col gap-2 lg:ml-8">
          {user && (
            <div className="text-xs">
              Comment as{" "}
              <Link
                href={`/u/${user.name}`}
                className="text-sky-500 hover:underline"
              >
                {user.name}
              </Link>
            </div>
          )}
          <RTEComment postId={post.id} />
        </div>
        <hr className="border-zinc-700/70 lg:ml-8" />
        <div className="flex grow flex-col gap-6 bg-zinc-900">
          <Comments
            comments={comments.filter((comment) => !comment.parentCommentId)}
            replies={comments.filter((comment) => comment.parentCommentId)}
          />
        </div>
      </div>
    </div>
  );
}
