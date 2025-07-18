"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { usePostContext } from "@/context/PostContext";
import { User, UserSchema } from "@/db/schema/users";
import useHydration from "@/hooks/useHydration";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
import defaultUserImage from "@public/defaultUserImage.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
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

  const { success, data: username } = UserSchema.shape.username
    .unwrap()
    .safeParse(state.author.username);

  return (
    <div className="flex items-center justify-between gap-2">
      {communityName ? (
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          {success ? (
            <HoverPrefetchLink
              href={`/u/${username}`}
              onClick={(e) => e.stopPropagation()}
              className="group text-foreground flex items-center gap-1.5"
            >
              <Avatar className="size-6">
                <AvatarImage src={state.author.image ?? defaultUserImage.src} />
                <AvatarFallback className="uppercase">
                  {username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="font-extrabold break-all group-hover:opacity-80">
                u/{username}
              </span>
            </HoverPrefetchLink>
          ) : (
            <div className="group text-foreground flex items-center gap-1.5">
              <Avatar className="size-6">
                <AvatarImage src={state.author.image ?? defaultUserImage.src} />
                <AvatarFallback className="uppercase">UN</AvatarFallback>
              </Avatar>
              <span className="font-extrabold break-all group-hover:opacity-80">
                u/{state.authorId.slice(0, 9)}
              </span>
            </div>
          )}

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
          <HoverPrefetchLink
            href={`/r/${state.community.name}`}
            className="group text-foreground flex items-center gap-1.5 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={state.community.icon ?? defaultCommunityIcon}
              alt={`${state.community.name} community icon`}
              width={24}
              height={24}
              className="rounded-full object-contain select-none"
            />
            <span className="font-extrabold break-all group-hover:opacity-80">
              r/{state.community.name}
            </span>
          </HoverPrefetchLink>
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
