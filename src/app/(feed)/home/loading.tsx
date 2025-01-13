import FeedPostInfiniteQuerySkeleton from "@/components/feed/FeedPostInfiniteQuerySkeleton";

export default async function Loading() {
  return (
    <div className="container flex gap-6 p-2 2xl:max-w-[1080px]">
      <FeedPostInfiniteQuerySkeleton />

      <div className="hidden w-80 xl:block" />
    </div>
  );
}
