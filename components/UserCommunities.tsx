import Image from "next/image";
import Link from "next/link";

import type { getUser } from "@/lib/api/getUser";
import cn from "@/lib/utils/cn";
import communityImage from "@/public/community-logo.svg";

export default function UserCommunities({
  communities,
}: {
  communities: NonNullable<
    Awaited<ReturnType<typeof getUser.execute>>
  >["communities"];
}) {
  if (communities.length === 0) return null;

  return (
    <div className="rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
      <h1 className="mb-6 max-w-[15rem] font-bold tracking-wide text-zinc-500">
        You&apos;re a moderator of these communities
      </h1>
      <div className="flex flex-col gap-3.5">
        {communities.map((community) => (
          <div key={community.id} className="flex items-center gap-1.5">
            {community.imageUrl ? (
              <Image
                src={community.imageUrl ?? communityImage}
                alt="community icon"
                width={32}
                height={32}
                className={cn("rounded-full", {
                  "border border-zinc-300 bg-zinc-300":
                    community.imageUrl === null,
                })}
              />
            ) : (
              <Image
                src={communityImage}
                alt="community icon"
                width={32}
                height={32}
                className="rounded-full border border-zinc-300 bg-zinc-300"
              />
            )}
            <div className="text-xs">
              <Link
                href={`/r/${community.name}`}
                className="max-w-[15rem] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap font-medium lowercase hover:underline"
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
