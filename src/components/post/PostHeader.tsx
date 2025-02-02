"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import useHydration from "@/hooks/useHydration";
import { trpc } from "@/trpc/client";
import { PostSort } from "@/types";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import CommunityImage from "../community/CommunityImage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PostDropdown from "./PostDropdown";

export default function PostHeader({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const { communityName, postId } = useParams();

  const utils = trpc.useUtils();

  const state = usePostContext();
  const hydrated = useHydration();

  const prefetchCommunity = () => {
    const userToCommunity = utils.community.getUserToCommunity;
    const communityByName = utils.community.getCommunityByName;
    const communityPosts = utils.postFeed.getCommunityPosts;

    if (currentUserId && !userToCommunity.getData(state.community.name)) {
      void userToCommunity.prefetch(state.community.name);
    }
    if (!communityByName.getData(state.community.name)) {
      void communityByName.prefetch(state.community.name);
    }
    if (
      !communityPosts.getInfiniteData({
        sort: PostSort.BEST,
        communityName: state.community.name,
      })
    ) {
      void communityPosts.prefetchInfinite({
        sort: PostSort.BEST,
        communityName: state.community.name,
      });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {postId ? (
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/r/${state.community.name}`}
            onTouchStart={prefetchCommunity}
            onMouseEnter={prefetchCommunity}
            onClick={(e) => e.stopPropagation()}
            className="block rounded-full"
          >
            <CommunityImage icon={state.community.icon} size={32} />
          </Link>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Link
                href={`/r/${state.community.name}`}
                onTouchStart={prefetchCommunity}
                onMouseEnter={prefetchCommunity}
                onClick={(e) => e.stopPropagation()}
                className="break-all font-extrabold text-foreground hover:opacity-80"
              >
                r/{state.community.name}
              </Link>
              <span>•</span>
              {hydrated ? (
                <time
                  dateTime={state.createdAt.toISOString()}
                  title={state.createdAt.toLocaleDateString("hr-HR")}
                >
                  {getRelativeTimeString(state.createdAt)}
                </time>
              ) : (
                <span>Calculating...</span>
              )}
            </div>
            <Link
              href={`/u/${state.author.username}`}
              onClick={(e) => e.stopPropagation()}
              className="break-all hover:opacity-80"
            >
              {state.author.username}
            </Link>
          </div>
        </div>
      ) : communityName ? (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link
            href={`/u/${state.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="group flex items-center gap-1.5 text-foreground"
          >
            <Avatar className="size-6">
              <AvatarImage src={state.author.imageUrl} />
              <AvatarFallback className="uppercase">
                {state.author.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="break-all font-extrabold group-hover:opacity-80">
              u/{state.author.username}
            </span>
          </Link>

          <span>•</span>
          {hydrated ? (
            <time
              dateTime={state.createdAt.toISOString()}
              title={state.createdAt.toLocaleDateString("hr-HR")}
            >
              {getRelativeTimeString(state.createdAt)}
            </time>
          ) : (
            <span>Calculating...</span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link
            href={`/r/${state.community.name}`}
            onTouchStart={prefetchCommunity}
            onMouseEnter={prefetchCommunity}
            onClick={(e) => e.stopPropagation()}
            className="group flex items-center gap-1.5 text-xs text-foreground"
          >
            <CommunityImage icon={state.community.icon} size={24} />
            <span className="break-all font-extrabold group-hover:opacity-80">
              r/{state.community.name}
            </span>
          </Link>
          <span>•</span>
          {hydrated ? (
            <time
              dateTime={state.createdAt.toISOString()}
              title={state.createdAt.toLocaleDateString("hr-HR")}
            >
              {getRelativeTimeString(state.createdAt)}
            </time>
          ) : (
            <span>Calculating...</span>
          )}
        </div>
      )}

      {currentUserId && <PostDropdown currentUserId={currentUserId} />}
    </div>
  );
}
