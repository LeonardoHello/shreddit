"use client";

import { BellSlashIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";

import type { getCommunityByName } from "@/api/getCommunity";
import type { User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import type { RouterInput, RouterOutput } from "@/trpc/routers/_app";
import cn from "@/utils/cn";
import CommunityImage from "./CommunityImage";

export default function CommunityHeader({
  currentUserId,
  community,
  initialData,
}: {
  currentUserId: User["id"] | null;
  community: NonNullable<
    Awaited<ReturnType<typeof getCommunityByName.execute>>
  >;
  initialData: RouterOutput["getUserToCommunity"];
}) {
  const { data: userToCommunity, refetch } = trpc.getUserToCommunity.useQuery(
    community.id,
    {
      initialData: initialData ?? {
        favorite: false,
        member: false,
        muted: false,
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const utils = trpc.useUtils();

  const queryConfig = {
    onMutate: (variables: RouterInput["joinCommunity" | "muteCommunity"]) => {
      if (!currentUserId) return;

      utils["getUserToCommunity"].setData(community.id, (updater) => {
        if (!updater) {
          toast.error("Oops, it seemes that data can't be loaded.");
          return userToCommunity;
        }

        return { ...updater, ...variables };
      });
    },
    onError: ({ message }: { message: string }) => {
      toast.error(message);
      refetch({ throwOnError: true });
    },
  };

  const joinCommunity = trpc.joinCommunity.useMutation({
    ...queryConfig,
    onSuccess: (data) => {
      if (data[0].member) {
        toast.success(`Successfully joined r/${community.name}`);
      } else {
        toast.success(`Successfully left r/${community.name}`);
      }
    },
  });

  const muteCommunity = trpc.muteCommunity.useMutation({
    ...queryConfig,
    onSuccess: (data) => {
      if (data[0].muted) {
        toast.success(
          "Unfollowed. You won't get updates on new activity anymore.",
        );
      } else {
        toast.success("Followed! Now you'll get updates on new activity.");
      }
    },
  });

  return (
    <>
      <div className="-z-10 h-12 bg-sky-600 md:h-20" />
      <div className="flex justify-center bg-zinc-900 px-4 py-2">
        <div className="flex w-[72rem] items-center gap-4">
          <CommunityImage
            imageUrl={community.imageUrl}
            size={56}
            className={cn(
              "-mt-5 min-w-[56px] self-start md:h-20 md:w-20 md:min-w-[80px]",
              {
                "border-2 md:border-4": !community.imageUrl,
              },
            )}
          />

          <div className="self-start">
            <h1 className="line-clamp-2 break-all text-lg font-bold before:content-['r/'] md:text-3xl md:before:content-['']">
              {community.name}
            </h1>
            <h2 className="hidden text-sm text-zinc-500 md:block">
              r/{community.name}
            </h2>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <button
              onClick={() => {
                joinCommunity.mutate({
                  member: !userToCommunity?.member ?? true,
                  communityId: community.id,
                });
              }}
              className={cn(
                "w-24 rounded-full border px-6 py-1.5 text-sm font-bold tracking-wide transition-colors",
                {
                  "before: border-zinc-300 before:content-['Joined'] hover:before:content-['Leave']":
                    userToCommunity?.member,
                  "border-transparent bg-zinc-300 text-zinc-900 before:content-['Join'] hover:bg-zinc-400":
                    !userToCommunity?.member,
                },
              )}
            />
            <button
              onClick={() => {
                muteCommunity.mutate({
                  muted: !userToCommunity?.muted ?? true,
                  communityId: community.id,
                });
              }}
              className="rounded-full border border-zinc-300 p-1"
            >
              {userToCommunity?.muted ? (
                <BellSlashIcon className="h-6 w-6" />
              ) : (
                <BellIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
