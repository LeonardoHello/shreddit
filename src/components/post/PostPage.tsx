import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { getPostById } from "@/api/getPost";
import Post from "@/components/post/Post";
import RTEComment from "@/components/RTE/RTEComment";
import PostContextProvider from "@/context/PostContext";

export default function PostPage({
  children,
  userId,
  username,
  postPromise,
}: {
  children: React.ReactNode;
  userId: User["id"] | null;
  username: User["username"] | null;
  postPromise: ReturnType<typeof getPostById.execute>;
}) {
  const post = use(postPromise);

  if (!post) notFound();

  return (
    <div className="-order-1 row-span-2 bg-zinc-900">
      <PostContextProvider post={post}>
        <Post currentUserId={userId} />
      </PostContextProvider>

      <div className="flex flex-col gap-4 p-4 pb-8">
        <div className="flex flex-col gap-2 lg:ml-8">
          {username && (
            <div className="text-xs">
              Comment as{" "}
              <Link
                href={`/u/${username}`}
                className="text-sky-500 hover:underline"
              >
                {username}
              </Link>
            </div>
          )}
          <RTEComment postId={post.id} />
        </div>

        <hr className="border-zinc-700/70 lg:ml-8" />

        <div className="flex grow flex-col gap-6 bg-zinc-900">{children}</div>
      </div>
    </div>
  );
}
