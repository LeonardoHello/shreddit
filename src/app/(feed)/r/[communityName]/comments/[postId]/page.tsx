import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import CommentSection from "@/components/comment/CommentSection";
import CommentSectionSkeleton from "@/components/comment/CommentSectionSkeleton";
import Post from "@/components/post/Post";
import PostSkeleton from "@/components/post/PostSkeleton";
import RTEComment from "@/components/RTE/RTEComment";
import RTECommentPlaceholder from "@/components/RTE/RTECommentPlaceholder";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/trpc/server";

export default async function PostPage(props: {
  params: Promise<{ communityName: string; postId: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  const postPromise = trpc.post.getPost(params.postId);
  const commentsPromise = trpc.comment.getComments(params.postId);

  return (
    <div id="post" className="flex w-0 grow scroll-mt-16 flex-col gap-2">
      <Suspense fallback={<PostSkeleton />}>
        <Post currentUserId={auth.userId} postPromise={postPromise} />
      </Suspense>

      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 pb-8">
        {auth.userId ? (
          <RTEComment postId={params.postId} />
        ) : (
          <RTECommentPlaceholder />
        )}

        <Separator />

        <Suspense fallback={<CommentSectionSkeleton />}>
          <CommentSection
            currentUserId={auth.userId}
            commentsPromise={commentsPromise}
          />
        </Suspense>
      </div>
    </div>
  );
}
