"use client";

import { useEffect } from "react";
import Image from "next/image";

import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReducerAction,
  useRecentCommunityDispatchContext,
} from "@/context/RecentCommunityContext";
import { trpc } from "@/trpc/client";
import communityBanner from "@public/communityBanner.jpg";
import { Button } from "../ui/button";
import CommunityImage from "./CommunityImage";

export default function CommunityHeaderAuthenticated({
  communityName,
}: {
  communityName: string;
}) {
  const dispatch = useRecentCommunityDispatchContext();

  const [community] =
    trpc.community.getCommunityByName.useSuspenseQuery(communityName);

  const [userToCommunity = { joined: false, favorited: false, muted: false }] =
    trpc.community.getUserToCommunity.useSuspenseQuery(communityName);

  if (!community) {
    throw new Error("Community not found");
  }

  useEffect(() => {
    dispatch({
      type: ReducerAction.ADD_COMMUNITY,
      community: {
        id: community.id,
        name: community.name,
        icon: community.icon,
      },
    });
  }, [dispatch, community.icon, community.id, community.name]);

  const utils = trpc.useUtils();

  const joinCommunity = trpc.community.toggleJoinCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return userToCommunity;
        }

        return { ...updater, joined: variables.joined };
      });
    },
    onSuccess: (data) => {
      utils.community.getCommunityByName.invalidate(communityName);
      utils.community.getJoinedCommunities.invalidate();

      if (data[0].joined) {
        toast.success(`Joined r/${community.name}`);
      } else {
        toast.success(`Left r/${community.name}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const favoriteCommunity = trpc.community.toggleFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return userToCommunity;
        }

        return { ...updater, favorited: variables.favorited };
      });
    },
    onSuccess: (data) => {
      utils.community.getJoinedCommunities.invalidate();
      utils.community.getModeratedCommunities.invalidate();

      if (data[0].favorited) {
        toast.success(`Added r/${community.name} to favorites.`);
      } else {
        toast.success(`Removed r/${community.name} from favorites.`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const muteCommunity = trpc.community.toggleMuteCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return userToCommunity;
        }

        return { ...updater, muted: variables.muted };
      });
    },
    onSuccess: (data) => {
      if (data[0].muted) {
        toast.success(`Muted r/${community.name}.`);
      } else {
        toast.success(`Unmuted r/${community.name}.`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <Image
        src={communityBanner}
        alt="shrek themed community banner"
        className="h-20 w-full rounded-lg object-cover md:h-32"
        placeholder="blur"
      />

      <div className="flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex h-12 gap-2">
          <CommunityImage
            icon={community.icon}
            size={56}
            className="size-[88px] self-end border-2 border-card bg-card md:border-4"
          />
          <h1 className="self-center break-all text-lg font-extrabold md:text-3xl">
            r/{community.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={userToCommunity.joined ? "outline" : "default"}
            className="h-10 rounded-full font-bold"
            onClick={() => {
              joinCommunity.mutate({
                communityId: community.id,
                joined: !userToCommunity.joined,
              });
            }}
          >
            {userToCommunity.joined ? "Joined" : "Join"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full">
                <Ellipsis className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded bg-card">
              <DropdownMenuItem
                className="px-4 py-3"
                onClick={() => {
                  favoriteCommunity.mutate({
                    communityId: community.id,
                    favorited: !userToCommunity.favorited,
                  });
                }}
              >
                {userToCommunity.favorited
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-3"
                onClick={() => {
                  muteCommunity.mutate({
                    communityId: community.id,
                    muted: !userToCommunity.muted,
                  });
                }}
              >
                {userToCommunity.muted ? "Unmute" : "Mute"} r/{community.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
