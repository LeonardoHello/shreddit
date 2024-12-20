"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";

import type { getYourCommunities } from "@/api/getCommunities";
import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import { PostType } from "@/types";
import cn from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";

type Router = ReturnType<typeof useRouter>;

export default function SubmitCommunityDropdown({
  username,
  imageUrl,
  yourCommunities,
  searchParams,
}: {
  username: User["username"];
  imageUrl: User["imageUrl"];
  yourCommunities: Awaited<ReturnType<typeof getYourCommunities.execute>>;
  searchParams: { type: PostType };
}) {
  const router = useRouter();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  useEffect(() => {
    return () => {
      dispatch({
        type: REDUCER_ACTION_TYPE.SEARCHED_COMMUNITY,
        nextSearch: "",
      });
    };
  }, [dispatch]);

  return (
    <>
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
          {yourCommunities.map((yourCommunity) => (
            <li
              key={yourCommunity.community.id}
              className="flex h-9 cursor-pointer items-center gap-2"
              onClick={() => {
                const params = new URLSearchParams(searchParams);

                router.push(
                  `/r/${yourCommunity.community.name}/submit?${params.toString()}`,
                );
              }}
            >
              <CommunityImage
                imageUrl={yourCommunity.community.imageUrl}
                size={32}
                className={cn({
                  "border-2": !yourCommunity.community.imageUrl,
                })}
              />

              <div className="truncate">
                <h1 className="truncate text-sm tracking-wide">
                  r/{yourCommunity.community.name}
                </h1>
                <h2 className="truncate text-xs font-light lowercase text-zinc-500">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(
                    yourCommunity.community.usersToCommunities.length,
                  )}{" "}
                  {yourCommunity.community.usersToCommunities.length === 1
                    ? "member"
                    : "members"}
                </h2>
              </div>
            </li>
          ))}
        </menu>
      </div>

      <hr className="border-zinc-700" />

      {state.search.length > 0 && (
        <SearchedCommunities
          search={state.search}
          router={router}
          searchParams={searchParams}
        />
      )}
    </>
  );
}

function SearchedCommunities({
  search,
  router,
  searchParams,
}: {
  search: string;
  router: Router;
  searchParams: { type: PostType };
}) {
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
              const params = new URLSearchParams(searchParams);

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
