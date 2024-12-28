import { Suspense } from "react";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";

import { getComments } from "@/api/getComment";
import { getPostById } from "@/api/getPost";
import Comments from "@/components/comment/Comments";
import Post from "@/components/post/Post";
import RTEComment from "@/components/RTE/RTEComment";

export default async function PostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  const paramsPromise = props.params;

  const userPromise = currentUser();

  const [params, user] = await Promise.all([paramsPromise, userPromise]).catch(
    (err) => {
      throw new Error(err);
    },
  );

  const postPromise = getPostById.execute({ postId: params.postId });
  const comments = await getComments.execute({ postId: params.postId });

  return (
    <div className="-order-1 row-span-2 bg-zinc-900">
      <Suspense fallback={<p>Loading...</p>}>
        <Post currentUserId={user && user.id} postPromise={postPromise} />
      </Suspense>

      <div className="flex flex-col gap-4 p-4 pb-8">
        <div className="flex flex-col gap-2 lg:ml-8">
          {user && (
            <div className="text-xs">
              Comment as{" "}
              <Link
                href={`/u/${user.username}`}
                className="text-sky-500 hover:underline"
              >
                {user.username}
              </Link>
            </div>
          )}
          <RTEComment postId={params.postId} />
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
