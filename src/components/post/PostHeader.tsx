"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import useHydration from "@/hooks/useHydration";
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

  const state = usePostContext();
  const hydrated = useHydration();

  return (
    <div className="flex items-center justify-between gap-2">
      {postId ? (
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/r/${state.community.name}`}
            className="block rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CommunityImage icon={state.community.icon} size={32} />
          </Link>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Link
                href={`/r/${state.community.name}`}
                className="font-extrabold text-foreground hover:opacity-80"
                onClick={(e) => e.stopPropagation()}
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
              className="hover:opacity-80"
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
            <span className="font-extrabold group-hover:opacity-80">
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
            onClick={(e) => e.stopPropagation()}
            className="group flex items-center gap-1.5 text-xs text-foreground"
          >
            <CommunityImage icon={state.community.icon} size={24} />
            <span className="font-extrabold group-hover:opacity-80">
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

      {currentUserId === state.authorId && (
        <PostDropdown currentUserId={currentUserId} />
      )}
    </div>
  );
}
