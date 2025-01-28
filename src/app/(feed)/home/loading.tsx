import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";

export default function Loading() {
  return (
    <div className="container flex gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <FeedPostInfiniteQuerySkeleton />

      <div className="hidden w-80 xl:block" />
    </div>
  );
}
