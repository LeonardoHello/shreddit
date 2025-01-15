import CommentSectionSkeleton from "@/components/comment/CommentSectionSkeleton";
import CommunitySidebarSkeleton from "@/components/community/CommunitySidebarSkeleton";
import PostSkeleton from "@/components/post/PostSkeleton";
import RTESkeleton from "@/components/RTE/RTESkeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="container flex grow gap-4 p-2 pb-6 2xl:max-w-[1080px]">
      <div className="flex grow flex-col gap-2">
        <PostSkeleton />

        <div className="flex flex-col gap-4 rounded border bg-card p-4 pb-8">
          <RTESkeleton />

          <Separator />

          <CommentSectionSkeleton />
        </div>
      </div>

      <CommunitySidebarSkeleton />
    </main>
  );
}
