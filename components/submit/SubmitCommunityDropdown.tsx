"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { toast } from "sonner";

import type { getYourCommunities } from "@/lib/api/getCommunities";
import type { getUserById } from "@/lib/api/getUser";
import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
} from "@/lib/context/SubmitContextProvider";
import communityImage from "@/public/community-logo.svg";
import { trpc } from "@/trpc/react";

type YourCommunities = Awaited<ReturnType<typeof getYourCommunities.execute>>;

type Props = {
  user: NonNullable<Awaited<ReturnType<typeof getUserById.execute>>>;
  yourCommunities: YourCommunities;
};

export default function SubmitCommunityDropdown({
  user,
  yourCommunities,
}: Props) {
  const { state, dispatch } = useSubmitContext();

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
            src={user.imageUrl}
            alt="community icon"
            width={32}
            height={32}
            className="rounded"
          />

          <h1 className="truncate text-center text-sm font-medium">
            u/{user.name}
          </h1>
        </div>
      </div>

      <hr className="border-zinc-700" />

      <YourCommunities yourCommunities={yourCommunities} />

      <hr className="border-zinc-700" />

      {state.search.length > 0 && <SearchedCommunities />}
    </>
  );
}

function YourCommunities({
  yourCommunities,
}: {
  yourCommunities: YourCommunities;
}) {
  const { state, dispatch } = useSubmitContext();

  return (
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
              if (yourCommunity.community.id === state.community?.id) {
                dispatch({
                  type: REDUCER_ACTION_TYPE.CHANGED_COMMUNITY,
                  nextCommunity: undefined,
                });
              } else {
                dispatch({
                  type: REDUCER_ACTION_TYPE.CHANGED_COMMUNITY,
                  nextCommunity: yourCommunity.community,
                });
              }
            }}
          >
            {yourCommunity.community.imageUrl ? (
              <Image
                src={yourCommunity.community.imageUrl}
                alt="community icon"
                width={32}
                height={32}
                className="rounded-full"
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

            <div className="flex flex-col">
              <h1 className="truncate text-sm">
                r/{yourCommunity.community.name}
              </h1>
              <h2 className="truncate text-xs lowercase text-zinc-500">
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
  );
}

function SearchedCommunities() {
  const { state, dispatch } = useSubmitContext();

  const searchedCommunities = trpc.searchCommunities.useQuery(state.search, {
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 2,
    useErrorBoundary: () => {
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
              if (searchedCommunity.id === state.community?.id) {
                dispatch({
                  type: REDUCER_ACTION_TYPE.CHANGED_COMMUNITY,
                  nextCommunity: undefined,
                });
              } else {
                dispatch({
                  type: REDUCER_ACTION_TYPE.CHANGED_COMMUNITY,
                  nextCommunity: searchedCommunity,
                });
              }
            }}
          >
            {searchedCommunity.imageUrl ? (
              <Image
                src={searchedCommunity.imageUrl}
                alt="community icon"
                width={32}
                height={32}
                className="rounded-full"
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

            <div className="flex flex-col">
              <h1 className="truncate text-sm">r/{searchedCommunity.name}</h1>
              <h2 className="truncate text-xs lowercase text-zinc-500">
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
