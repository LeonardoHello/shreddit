import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import CommunityAbout from "@/components/community/CommunityAbout";
import CommunityHeader from "@/components/community/CommunityHeader";
import ScrollToTop from "@/components/feed/ScrollToTop";
import { getCommunityByName } from "@/lib/api/getCommunity";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function CommunityLayout({
  params,
  children,
}: {
  params: { communityName: string };
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const { communityName } = params;

  const community = await getCommunityByName.execute({
    communityName,
  });

  if (community === undefined) return notFound();

  const userToCommunity = community.usersToCommunities.find(
    (userToCommunity) => userToCommunity.userId === userId,
  );

  const newMemberCount = community.usersToCommunities.filter(
    (userToCommunity) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return monthAgo < userToCommunity.createdAt;
    },
  ).length;

  return (
    <>
      <CommunityHeader
        currentUserId={userId}
        community={community}
        initialData={userToCommunity}
      />

      <div className="container mx-auto grid grid-flow-col grid-rows-[auto,1fr] gap-6 px-2 py-4 lg:grid-cols-[2fr,1fr] lg:pb-12 xl:max-w-6xl">
        {children}
        <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
          <div className="sticky top-4 flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
            <CommunityAbout community={community} currentUserId={userId} />
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
          <ScrollToTop />
        </div>
      </div>
    </>
  );
}
