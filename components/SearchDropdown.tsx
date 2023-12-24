import Image from "next/image";
import Link from "next/link";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import calculateOnions from "@/lib/utils/calculateOnions";
import cn from "@/lib/utils/cn";
import communityImage from "@/public/community-logo.svg";
import dot from "@/public/dot.svg";
import { trpc } from "@/trpc/react";

export default function SearchDropdown({
  searchedValue,
}: {
  searchedValue: string;
}) {
  const searchedCommunities = trpc.searchCommunities.useQuery(searchedValue, {
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 2,
    useErrorBoundary: () => {
      toast.error("There was a problem with fetching the communities");
      return false;
    },
  });

  const searchedUsers = trpc.searchUsers.useQuery(searchedValue, {
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 2,
    useErrorBoundary: () => {
      toast.error("There was a problem with fetching the users");
      return false;
    },
  });

  return (
    <div className="absolute top-full z-20 w-full rounded-sm border border-zinc-700/70 border-t-transparent bg-inherit shadow-md shadow-zinc-300/20">
      {searchedCommunities.data.length > 0 && (
        <div className="py-3">
          <h2 className="mx-4 mb-2.5 text-sm font-medium">Communities</h2>
          {searchedCommunities.data.map((community) => (
            <Link
              href={`/r/${community.name}`}
              key={community.name}
              className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700/30"
            >
              <Image
                src={community.imageUrl ?? communityImage}
                alt="community image"
                className={cn("h-6 w-6  rounded-full", {
                  "border border-zinc-300 bg-zinc-300":
                    community.imageUrl === null,
                })}
              />
              <div className="min-w-0">
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-medium">
                  r/{community.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Community</span>
                  <Image src={dot} alt="dot" height={4} width={4} />
                  <span className="overflow-hidden overflow-ellipsis whitespace-nowrap lowercase">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(community.usersToCommunities.length)}{" "}
                    {community.usersToCommunities.length === 1
                      ? "member"
                      : "members"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {searchedUsers.data.length > 0 && (
        <div
          className={cn("py-3", {
            "border-t border-zinc-700/70": searchedCommunities.data.length > 0,
          })}
        >
          <h2 className="mx-4 mb-2.5 text-sm font-medium">Users</h2>
          {searchedUsers.data.map((user) => (
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
              <div className="min-w-0">
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-medium">
                  u/{user.name}
                </div>
                <div className="flex items-center gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-zinc-500">
                  <span>User</span>
                  <Image src={dot} alt="dot" height={4} width={4} />
                  <span className="overflow-hidden overflow-ellipsis whitespace-nowrap lowercase">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(calculateOnions(user))}{" "}
                    {calculateOnions(user) === 1 ? "onion" : "onions"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-zinc-700/70 px-3.5 py-2 text-sm">
        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-300" />
        <p>Search for &ldquo;{searchedValue}&rdquo;</p>
      </div>
    </div>
  );
}
