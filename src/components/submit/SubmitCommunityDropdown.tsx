"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";

import type { getMyCommunities } from "@/api/getCommunities";
import { useSubmitContext } from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";

export default function SubmitCommunityDropdown({
  username,
  imageUrl,
  myCommunitiesPromise,
}: {
  username: User["username"];
  imageUrl: User["imageUrl"];
  myCommunitiesPromise: ReturnType<typeof getMyCommunities.execute>;
}) {
  const router = useRouter();

  const state = useSubmitContext();

  const myCommunities = use(myCommunitiesPromise);

  return (
    <div className="absolute top-full z-10 flex max-h-96 w-full flex-col overflow-x-hidden rounded-b border-x border-b border-zinc-700/70 bg-zinc-900">
      <div className="flex flex-col gap-3.5 px-2 pb-3 pt-4">
        <h2 className="px-2 text-2xs font-medium uppercase tracking-wide text-zinc-300/60">
          your profile
        </h2>
        <div className="flex items-center gap-2">
          <Image
            src={imageUrl}
            alt="user profile"
            width={32}
            height={32}
            className="rounded"
          />

          <h1 className="truncate text-center text-sm font-medium">
            u/{username}
          </h1>
        </div>
      </div>

      <hr className="border-zinc-700" />

      <div className="flex flex-col gap-3.5 px-2 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="px-2 py-1 text-2xs font-medium uppercase tracking-wide text-zinc-300/60">
            your communities
          </h2>
          <h2 className="rounded-full leading-none">
            <Link
              href={{ query: { submit: "community" } }}
              className="rounded-full px-3 py-1 text-xs font-bold capitalize tracking-wide text-zinc-300 hover:bg-zinc-800"
            >
              crete new
            </Link>
          </h2>
        </div>

        <menu className="flex flex-col gap-3.5 text-sm font-medium">
          {myCommunities.map((myCommunity) => (
            <li
              key={myCommunity.community.id}
              className="flex h-9 cursor-pointer items-center gap-2"
              onClick={() => {
                const params = new URLSearchParams({ type: state.type });

                router.push(
                  `/r/${myCommunity.community.name}/submit?${params.toString()}`,
                );
              }}
            >
              <CommunityImage
                imageUrl={myCommunity.community.imageUrl}
                size={32}
                className={cn({
                  "border-2": !myCommunity.community.imageUrl,
                })}
              />

              <div className="truncate">
                <h1 className="truncate text-sm tracking-wide">
                  r/{myCommunity.community.name}
                </h1>
                <h2 className="truncate text-xs font-light lowercase text-zinc-500">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(
                    myCommunity.community.usersToCommunities.length,
                  )}{" "}
                  {myCommunity.community.usersToCommunities.length === 1
                    ? "member"
                    : "members"}
                </h2>
              </div>
            </li>
          ))}
        </menu>
      </div>

      <hr className="border-zinc-700" />

      {state.communitySearch.length > 0 && (
        <SearchedCommunities search={state.communitySearch} />
      )}
    </div>
  );
}

function SearchedCommunities({ search }: { search: string }) {
  const router = useRouter();

  const state = useSubmitContext();

  const searchedCommunities = trpc.searchCommunities.useQuery(search, {
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: () => {
      toast.error("There was a problem with fetching the communities");
      return false;
    },
  });

  return (
    <div className="flex flex-col gap-3.5 px-2 pb-3 pt-4">
      <h2 className="px-2 py-1 text-2xs font-medium uppercase tracking-wide text-zinc-300/60">
        others
      </h2>

      <menu className="flex flex-col gap-3.5 text-sm font-medium">
        {searchedCommunities.data.map((searchedCommunity) => (
          <li
            key={searchedCommunity.id}
            className="flex h-9 cursor-pointer items-center gap-2"
            onClick={() => {
              const params = new URLSearchParams({ type: state.type });

              router.push(
                `/r/${searchedCommunity.name}/submit?${params.toString()}`,
              );
            }}
          >
            <CommunityImage
              imageUrl={searchedCommunity.imageUrl}
              size={32}
              className={cn({
                "border-2": !searchedCommunity.imageUrl,
              })}
            />

            <div className="truncate">
              <h1 className="truncate text-sm tracking-wide">
                r/{searchedCommunity.name}
              </h1>
              <h2 className="truncate text-xs font-light lowercase text-zinc-500">
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(searchedCommunity.usersToCommunities.length)}{" "}
                {searchedCommunity.usersToCommunities.length === 1
                  ? "member"
                  : "members"}
              </h2>
            </div>
          </li>
        ))}
      </menu>
    </div>
  );
}
