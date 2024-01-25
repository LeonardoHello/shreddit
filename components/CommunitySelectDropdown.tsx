"use client";

import Image from "next/image";

import type { getSelectableCommunities } from "@/lib/api/getCommunities";
import type { getUserById } from "@/lib/api/getUser";
import { useSubmitContext } from "@/lib/context/SubmitContextProvider";
import communityImage from "@/public/community-logo.svg";

type Props = {
  user: NonNullable<Awaited<ReturnType<typeof getUserById.execute>>>;
  selectableCommunities: Awaited<
    ReturnType<typeof getSelectableCommunities.execute>
  >;
};

export default function CommunitySelectDropdown({
  user,
  selectableCommunities,
}: Props) {
  const { setSelectedCommunity } = useSubmitContext();

  return (
    <div className="absolute top-full flex max-h-[30rem] w-64 flex-col overflow-x-hidden rounded-b border-x border-b border-zinc-700/70 bg-inherit lg:w-full">
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

          <h1 className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm font-medium lg:block">
            u/{user.name}
          </h1>
        </div>
      </div>

      <hr className="border-zinc-700" />

      <div className="flex flex-col gap-3.5 px-2 pb-3 pt-4">
        <h2 className="px-2 text-2xs font-medium uppercase tracking-wide text-zinc-300/60">
          your communities
        </h2>
        <menu className="flex flex-col gap-3.5 text-sm font-medium">
          {selectableCommunities.map((selectableCommunity) => (
            <li
              key={selectableCommunity.community.id}
              className="flex h-9 cursor-pointer items-center gap-2"
              onClick={() =>
                setSelectedCommunity(selectableCommunity.community)
              }
            >
              {selectableCommunity.community.imageUrl ? (
                <Image
                  src={selectableCommunity.community.imageUrl}
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
                <h1 className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-sm lg:block">
                  r/{selectableCommunity.community.name}
                </h1>
                <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xs lowercase text-zinc-500">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(
                    selectableCommunity.community.usersToCommunities.length,
                  )}{" "}
                  {selectableCommunity.community.usersToCommunities.length === 1
                    ? "member"
                    : "members"}
                </h2>
              </div>
            </li>
          ))}
        </menu>
      </div>
    </div>
  );
}
