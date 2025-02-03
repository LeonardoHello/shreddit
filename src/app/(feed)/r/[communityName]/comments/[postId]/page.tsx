import { auth as authPromise } from "@clerk/nextjs/server";

import CommentSection from "@/components/comment/CommentSection";
import Post from "@/components/post/Post";
import RTEComment from "@/components/RTE/RTEComment";
import RTECommentPlaceholder from "@/components/RTE/RTECommentPlaceholder";
import { Separator } from "@/components/ui/separator";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function PostPage(props: {
  params: Promise<{ communityName: string; postId: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  void trpc.post.getPost.prefetch(params.postId);
  void trpc.comment.getComments.prefetch(params.postId);

  return (
    <div id="post" className="flex w-0 grow scroll-mt-16 flex-col gap-2">
      <HydrateClient>
        <Post currentUserId={auth.userId} postId={params.postId} />
      </HydrateClient>

      <div className="flex flex-col gap-4 rounded border bg-card p-4 pb-8">
        {auth.userId ? (
          <RTEComment postId={params.postId} />
        ) : (
          <RTECommentPlaceholder />
        )}

        <Separator />

        <HydrateClient>
          <CommentSection currentUserId={auth.userId} postId={params.postId} />
        </HydrateClient>
      </div>
    </div>
  );
}
