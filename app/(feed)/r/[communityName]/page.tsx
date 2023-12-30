import Link from "next/link";
import { notFound } from "next/navigation";

import { currentUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";

import CommunityAbout from "@/components/CommunityAbout";
import CommunityHeader from "@/components/CommunityHeader";
import FeedInput from "@/components/FeedInput";
import FeedSort from "@/components/FeedSort";
import InfiniteQueryPosts from "@/components/InfiniteQueryPosts";
import { getCommunity, getUserToCommunity } from "@/lib/api/getCommunity";
import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/lib/api/getPosts/getCommunityPosts";
import { type QueryInfo, SortPosts } from "@/lib/types";

export const runtime = "edge";

export default async function CommunityPage({
  params: { communityName },
  searchParams: { sort },
}: {
  params: { communityName: string };
  searchParams: { sort: string | undefined };
}) {
  const { userId } = auth();

  let posts;
  switch (sort) {
    case SortPosts.HOT:
      posts = await getCommunityHotPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.NEW:
      posts = await getCommunityNewPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      posts = await getCommunityControversialPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    default:
      posts = await getCommunityBestPosts.execute({
        offset: 0,
        communityName,
      });
      break;
  }

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: { communityName, sort },
  };

  const community = await getCommunity.execute({
    communityName,
  });

  if (community === undefined) return notFound();

  const user = await currentUser();

  const newMemberCount = community.usersToCommunities.filter(
    (userToCommunity) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return monthAgo < userToCommunity.createdAt;
    },
  ).length;

  const userToCommunity = await getUserToCommunity.execute({
    communityId: community.id,
    userId: user?.id,
  });

  return (
    <main className="flex grow flex-col">
      <div className="relative -z-10 h-12 bg-sky-600 md:h-20" />
      <CommunityHeader
        isAuthenticated={user ? true : false}
        community={community}
        initialData={userToCommunity}
      />
      <div className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
        <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
          {user && (
            <FeedInput userImageUrl={user.imageUrl} userName={user.username} />
          )}
          <FeedSort />

          <InfiniteQueryPosts<"getCommunityPosts">
            currentUserId={userId}
            initialPosts={{ posts, nextCursor }}
            queryInfo={queryInfo}
          />
        </div>
        <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
          <div className="flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
            <CommunityAbout community={community} currentUserId={user?.id} />
            <hr className="border-zinc-700/70" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div
                  title={`${community.usersToCommunities.length} members`}
                  className="text-base"
                >
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(community.usersToCommunities.length)}
                </div>
                <div className="text-xs text-zinc-500">Members</div>
              </div>
              <div className="flex flex-col">
                <div
                  title={`${newMemberCount} new members`}
                  className="text-base"
                >
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(newMemberCount)}
                </div>
                <div className="text-xs text-zinc-500">New Members</div>
              </div>
              <div />
            </div>
            <hr className="border-zinc-700/70" />
            <div>
              <Link href="/submit" className="rounded-full">
                <button className="w-full rounded-full bg-zinc-300 p-1.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400">
                  Create Post
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
