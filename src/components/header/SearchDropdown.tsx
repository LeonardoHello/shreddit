import Image from "next/image";
import Link from "next/link";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Dot } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import calculateOnions from "@/utils/calculateOnions";
import CommunityImage from "../community/CommunityImage";

export default function SearchDropdown({
  searchedValue,
}: {
  searchedValue: string;
}) {
  const searchedCommunities = trpc.community.searchCommunities.useQuery(
    searchedValue,
    {
      initialData: [],
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 2,
      throwOnError: () => {
        toast.error("There was a problem with fetching the communities");
        return false;
      },
    },
  );

  const searchedUsers = trpc.user.searchUsers.useQuery(searchedValue, {
    initialData: [],
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: 2,
    throwOnError: () => {
      toast.error("There was a problem with fetching the users");
      return false;
    },
  });

  return (
    <div
      style={{
        scrollbarWidth: "thin",
        colorScheme: "dark",
      }}
      className="absolute left-0 top-12 max-h-[min(calc(100vh-3rem),24rem)] w-full divide-y divide-zinc-700/70 overflow-y-scroll rounded-sm border border-zinc-700/70 border-t-transparent bg-inherit shadow-md shadow-zinc-300/20 sm:top-full"
    >
      {searchedCommunities.data.length > 0 && (
        <div className="py-3">
          <h2 className="mx-4 mb-2.5 text-sm font-medium">Communities</h2>
          {searchedCommunities.data.map((community) => (
            <Link
              href={`/r/${community.name}`}
              key={community.name}
              className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700/30"
            >
              <CommunityImage imageUrl={community.imageUrl} size={24} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  r/{community.name}
                </div>
                <div className="flex items-center text-xs text-zinc-500">
                  <span>Community</span>
                  <Dot className="size-3" />
                  <span className="truncate lowercase">
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
        <div className="py-3">
          <h2 className="mx-4 mb-2.5 text-sm font-medium">Users</h2>
          {searchedUsers.data.map((user) => (
            <Link
              href={`/u/${user.username}`}
              key={user.username}
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
                <div className="truncate text-sm font-medium">
                  u/{user.username}
                </div>
                <div className="flex items-center truncate text-xs text-zinc-500">
                  <span>User</span>
                  <Dot className="size-3" />
                  <span className="truncate lowercase">
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

      <div className="flex items-center gap-2 px-3.5 py-2 text-sm">
        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-300" />
        <p>Search for &ldquo;{searchedValue}&rdquo;</p>
      </div>
    </div>
  );
}
