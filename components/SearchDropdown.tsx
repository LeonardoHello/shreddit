import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import communityImage from "@/public/community-logo.svg";
import dot from "@/public/dot.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import type { RouterOutput } from "@/trpc/server/procedures";
type Prop = {
  searchedValue: string;
  communities: RouterOutput["searchCommunities"];
  users: RouterOutput["searchUsers"];
};

export default function SearchDropdown({
  searchedValue,
  users,
  communities,
}: Prop) {
  return (
    <div className="absolute top-full w-full rounded-sm border border-zinc-700 border-t-transparent bg-inherit shadow-md shadow-zinc-300/20">
      {communities.length > 0 ? (
        <div className="py-3">
          <h2 className="mx-4 mb-2.5 text-sm font-medium">Communities</h2>
          {communities.map((community) => (
            <Link
              href={`/r/${community.name}`}
              key={community.name}
              className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700/30"
            >
              <Image
                src={community.imageUrl ?? communityImage}
                alt="community image"
                className={clsx("h-6 w-6  rounded-full", {
                  "border border-zinc-300 bg-zinc-300":
                    community.imageUrl === null,
                })}
              />
              <div>
                <div className="text-sm font-medium">r/{community.name}</div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Community</span>
                  <Image src={dot} alt="dot" height={5} width={5} />
                  <span className="lowercase">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(community.usersToCommunities.length)}{" "}
                    {community.usersToCommunities.length === 1
                      ? "member"
                      : "members"}
                  </span>
                  {community.nsfw ? (
                    <>
                      <Image src={dot} alt="dot" height={5} width={5} />
                      <span className="text-rose-500">NSFW</span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {users.length > 0 ? (
        <div
          className={clsx("py-3", {
            "border-t border-zinc-700": communities.length > 0,
          })}
        >
          <h2 className="mx-4 mb-2.5 text-sm font-medium">Users</h2>
          {users.map((user) => (
            <Link
              href={`/u/${user.name}`}
              key={user.name}
              className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700/30"
            >
              <Image
                src={user.imageUrl}
                alt="community image"
                height={24}
                width={24}
                className="rounded-full"
              />
              <div>
                <div className="text-sm font-medium">u/{user.name}</div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>User</span>
                  <Image src={dot} alt="dot" height={5} width={5} />
                  <span className="lowercase">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(user.onions)}{" "}
                    {user.onions === 1 ? "onion" : "onions"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2 border-t border-zinc-700 px-3.5 py-2 text-sm">
        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-300" />
        <p>Search for &ldquo;{searchedValue}&rdquo;</p>
      </div>
    </div>
  );
}
