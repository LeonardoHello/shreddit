import { Suspense } from "react";

import { auth as authPromise } from "@clerk/nextjs/server";

import CommentSection from "@/components/comment/CommentSection";
import CommentSectionSkeleton from "@/components/comment/CommentSectionSkeleton";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import CommunitySidebarSkeleton from "@/components/community/CommunitySidebarSkeleton";
import Post from "@/components/post/Post";
import PostSkeleton from "@/components/post/PostSkeleton";
import RTEComment from "@/components/RTE/RTEComment";
import RTECommentPlaceholder from "@/components/RTE/RTECommentPlaceholder";
import { Separator } from "@/components/ui/separator";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function PostPage(props: {
  params: Promise<{ communityName: string; postId: string }>;
}) {
  const [params, auth] = await Promise.all([props.params, authPromise()]);

  trpc.post.getPost.prefetch(params.postId);
  trpc.comment.getComments.prefetch(params.postId);
  trpc.community.getCommunityByName.prefetch(params.communityName);

  return (
    <main className="container flex grow gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <div className="flex w-0 grow flex-col gap-2">
        <HydrateClient>
          <Suspense fallback={<PostSkeleton />}>
            <Post currentUserId={auth.userId} postId={params.postId} />
          </Suspense>
        </HydrateClient>

        <div className="flex flex-col gap-4 rounded border bg-card p-4 pb-8">
          {auth.userId ? (
            <RTEComment postId={params.postId} />
          ) : (
            <RTECommentPlaceholder />
          )}

          <Separator />

          <HydrateClient>
            <Suspense fallback={<CommentSectionSkeleton />}>
              <CommentSection
                currentUserId={auth.userId}
                postId={params.postId}
              />
            </Suspense>
          </HydrateClient>
        </div>
      </div>

      <HydrateClient>
        <Suspense fallback={<CommunitySidebarSkeleton />}>
          <CommunitySidebar communityName={params.communityName} />
        </Suspense>
      </HydrateClient>
    </main>
  );
}
