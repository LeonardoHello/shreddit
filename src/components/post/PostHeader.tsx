"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import CommunityImage from "../community/CommunityImage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PostDeleteDialog from "./PostDeleteDialog";
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
      {communityName ? (
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Link
            href={`/u/${state.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="group text-foreground flex items-center gap-1.5"
          >
            <Avatar className="size-6">
              <AvatarImage src={state.author.imageUrl} />
              <AvatarFallback className="uppercase">
                {state.author.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="font-extrabold break-all group-hover:opacity-80">
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
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Link
            href={`/r/${state.community.name}`}
            onClick={(e) => e.stopPropagation()}
            className="group text-foreground flex items-center gap-1.5 text-xs"
          >
            <CommunityImage icon={state.community.icon} size={24} />
            <span className="font-extrabold break-all group-hover:opacity-80">
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

      {currentUserId && (
        <PostDropdown currentUserId={currentUserId}>
          <PostDeleteDialog isPostPage={typeof postId === "string"} />
        </PostDropdown>
      )}
    </div>
  );
}
