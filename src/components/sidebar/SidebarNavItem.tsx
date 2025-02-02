"use client";

import Link from "next/link";

import { useAuth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { RouterOutput } from "@/trpc/routers/_app";
import { PostSort, type ArrElement } from "@/types";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";
import { Button } from "../ui/button";

export default function SidebarNavItem({
  userToCommunity,
  canFavorite,
}: {
  userToCommunity: ArrElement<
    RouterOutput["community"]["getJoinedCommunities"]
  >;
  canFavorite?: boolean;
}) {
  const auth = useAuth();
  const utils = trpc.useUtils();

  const { name, icon } = userToCommunity.community;

  const toggleFavorite = trpc.community.toggleFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      const { communityId, favorited } = variables;

      utils.community.getModeratedCommunities.setData(undefined, (updater) => {
        if (!updater) {
          return [];
        }

        return updater.map((_userToCommunity) => {
          if (communityId !== _userToCommunity.community.id)
            return _userToCommunity;

          return { ..._userToCommunity, favorited };
        });
      });

      utils.community.getJoinedCommunities.setData(undefined, (updater) => {
        if (!updater) {
          return [];
        }

        return updater.map((_userToCommunity) => {
          if (communityId !== _userToCommunity.community.id)
            return _userToCommunity;

          return { ..._userToCommunity, favorited };
        });
      });
    },
    onSuccess: () => {
      utils.community.getUserToCommunity.invalidate(name);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const prefetchCommunity = () => {
    const userToCommunity = utils.community.getUserToCommunity;
    const communityByName = utils.community.getCommunityByName;
    const communityPosts = utils.postFeed.getCommunityPosts;

    if (auth.isSignedIn && !userToCommunity.getData(name)) {
      void userToCommunity.prefetch(name);
    }
    if (!communityByName.getData(name)) {
      void communityByName.prefetch(name);
    }
    if (
      !communityPosts.getInfiniteData({
        sort: PostSort.BEST,
        communityName: name,
      })
    ) {
      void communityPosts.prefetchInfinite({
        sort: PostSort.BEST,
        communityName: name,
      });
    }
  };

  return (
    <li key={userToCommunity.community.id} className="flex">
      <Button
        variant="ghost"
        size="lg"
        className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
        onTouchStart={prefetchCommunity}
        onMouseEnter={prefetchCommunity}
        asChild
      >
        <Link href={`/r/${name}`}>
          <CommunityImage icon={icon} size={32} />
          <h2 className="truncate">r/{name}</h2>
          {canFavorite && (
            <Star
              className={cn("ml-auto size-5 stroke-1", {
                "fill-foreground text-foreground": userToCommunity.favorited,
              })}
              onClick={(e) => {
                e.preventDefault();

                toggleFavorite.mutate({
                  communityId: userToCommunity.community.id,
                  favorited: !userToCommunity.favorited,
                });
              }}
            />
          )}
        </Link>
      </Button>
    </li>
  );
}
