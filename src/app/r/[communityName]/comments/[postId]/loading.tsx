import CommentSectionSkeleton from "@/components/comment/CommentSectionSkeleton";
import PostSkeleton from "@/components/post/PostSkeleton";
import RTESkeleton from "@/components/RTE/RTESkeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="flex grow flex-col gap-2">
      <PostSkeleton />

      <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 pb-8">
        <RTESkeleton />

        <Separator />

        <CommentSectionSkeleton />
      </div>
    </div>
  );
}
