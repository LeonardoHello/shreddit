"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { usePostContext } from "@/context/PostContext";
import { User, UserSchema } from "@/db/schema/users";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import donkey from "@public/donkey.png";
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

  const username = UserSchema.shape.username
    .unwrap()
    .parse(state.author.username);

  return (
    <div className="flex items-center justify-between gap-2">
      {communityName ? (
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Link
            href={`/u/${username}`}
            onClick={(e) => e.stopPropagation()}
            className="group text-foreground flex items-center gap-1.5"
          >
            <Avatar className="size-6">
              <AvatarImage src={state.author.image ?? donkey.src} />
              <AvatarFallback className="uppercase">
                {username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="font-extrabold break-all group-hover:opacity-80">
              u/{username}
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
