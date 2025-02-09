import { auth as authPromise } from "@clerk/nextjs/server";

import CommentSection from "@/components/comment/CommentSection";
import Post from "@/components/post/Post";
import RTEComment from "@/components/RTE/RTEComment";
import RTECommentPlaceholder from "@/components/RTE/RTECommentPlaceholder";
import { Separator } from "@/components/ui/separator";

export default async function PostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  return (
    <div id="post" className="flex w-0 grow scroll-mt-16 flex-col gap-2">
      <Post currentUserId={auth.userId} postId={params.postId} />

      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 pb-8">
        {auth.userId ? (
          <RTEComment postId={params.postId} />
        ) : (
          <RTECommentPlaceholder />
        )}

        <Separator />

        <CommentSection currentUserId={auth.userId} postId={params.postId} />
      </div>
    </div>
  );
}
