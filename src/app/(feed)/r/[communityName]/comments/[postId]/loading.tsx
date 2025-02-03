import CommentSectionSkeleton from "@/components/comment/CommentSectionSkeleton";
import PostSkeleton from "@/components/post/PostSkeleton";
import RTESkeleton from "@/components/RTE/RTESkeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="flex grow flex-col gap-2">
      <PostSkeleton />

      <div className="flex flex-col gap-4 rounded border bg-card p-4 pb-8">
        <RTESkeleton />

        <Separator />

        <CommentSectionSkeleton />
      </div>
    </main>
  );
}
