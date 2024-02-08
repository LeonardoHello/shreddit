import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import CommunityAbout from "@/components/community/CommunityAbout";
import CommunityHeader from "@/components/community/CommunityHeader";
import FeedInput from "@/components/feed/FeedInput";
import FeedSort from "@/components/feed/FeedSort";
import PostsInfiniteQuery from "@/components/post/PostsInfiniteQuery";
import { getCommunityByName } from "@/lib/api/getCommunity";
import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/lib/api/getPosts/getCommunityPosts";
import { getUserById } from "@/lib/api/getUser";
import { type QueryInfo, SortPosts } from "@/lib/types";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: { communityName: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  const { communityName } = params;
  const { sort } = searchParams;

  let postsData;
  switch (sort) {
    case SortPosts.HOT:
      postsData = getCommunityHotPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.NEW:
      postsData = getCommunityNewPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    case SortPosts.CONTROVERSIAL:
      postsData = getCommunityControversialPosts.execute({
        offset: 0,
        communityName,
      });
      break;

    default:
      postsData = getCommunityBestPosts.execute({
        offset: 0,
        communityName,
      });
      break;
  }

  const userData = getUserById.execute({ currentUserId: userId });
  const communityData = getCommunityByName.execute({
    communityName,
  });

  const [user, community, posts] = await Promise.all([
    userData,
    communityData,
    postsData,
  ]).catch(() => {
    throw new Error("There was a problem with loading community information.");
  });

  if (community === undefined) return notFound();

  const userToCommunity = community.usersToCommunities.find(
    (userToCommunity) => userToCommunity.userId === userId,
  );

  let nextCursor: QueryInfo<"getCommunityPosts">["input"]["cursor"] = null;
  if (posts.length === 10) {
    nextCursor = 10;
  }

  const queryInfo: QueryInfo<"getCommunityPosts"> = {
    procedure: "getCommunityPosts",
    input: { communityName, sort },
  };

  const newMemberCount = community.usersToCommunities.filter(
    (userToCommunity) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return monthAgo < userToCommunity.createdAt;
    },
  ).length;

  return (
    <>
      <div className="relative -z-10 h-12 bg-sky-600 md:h-20" />
      <CommunityHeader
        currentUserId={userId}
        community={community}
        initialData={userToCommunity}
      />

      <main className="grid w-full max-w-5xl grow grid-flow-col grid-rows-[auto,1fr] gap-6 self-center p-2 py-4 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-2.5">
          {user && <FeedInput user={user} communityName={communityName} />}
          <FeedSort searchParams={searchParams} />
        </div>
        <PostsInfiniteQuery<"getCommunityPosts">
          currentUserId={userId}
          initialPosts={{ posts, nextCursor }}
          queryInfo={queryInfo}
          params={params}
          searchParams={searchParams}
        />
        <div className="row-span-2 hidden flex-col gap-4 text-sm lg:flex">
          <div className="sticky top-16 flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
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
              <Link
                href={{
                  pathname: "/submit",
                  query: { community: communityName },
                }}
                className="rounded-full"
              >
                <button className="w-full rounded-full bg-zinc-300 p-1.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400">
                  Create Post
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
