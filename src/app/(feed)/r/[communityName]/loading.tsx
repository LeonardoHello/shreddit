import CommunityHeaderSkeleton from "@/components/community/CommunityHeaderSkeleton";
import CommunitySidebarSkeleton from "@/components/community/CommunitySidebarSkeleton";
import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";

export default function Loading() {
  // Define the Loading UI here
  return (
    <div className="container flex flex-col gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <CommunityHeaderSkeleton />

      <div className="flex justify-center gap-4">
        <FeedPostInfiniteQuerySkeleton />

        <CommunitySidebarSkeleton />
      </div>
    </div>
  );
}
