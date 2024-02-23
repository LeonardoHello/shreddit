import Link from "next/link";

import type { getUserByName } from "@/lib/api/getUser";

import CommunityImage from "../community/CommunityImage";

export default function ModeratedCommunities({
  communities,
}: {
  communities: NonNullable<
    Awaited<ReturnType<typeof getUserByName.execute>>
  >["communities"];
}) {
  if (communities.length === 0) return null;

  return (
    <div className="rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
      <h1 className="mb-6 max-w-[15rem] font-bold tracking-wide text-zinc-500">
        Moderator of these communities
      </h1>
      <div className="flex flex-col gap-3.5">
        {communities.map((community) => (
          <div key={community.id} className="flex items-center gap-1.5">
            <CommunityImage imageUrl={community.imageUrl} size={32} />

            <div className="truncate text-xs tracking-wide">
              <Link
                href={`/r/${community.name}`}
                className="max-w-[15rem] cursor-pointer font-medium lowercase hover:underline"
              >
                r/{community.name}
              </Link>
              <div>
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(community.usersToCommunities.length)}{" "}
                {community.usersToCommunities.length === 1
                  ? "member"
                  : "members"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
