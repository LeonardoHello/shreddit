"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Dot } from "lucide-react";

import { usePostContext } from "@/context/PostContext";
import useHydration from "@/hooks/useHydration";
import { cn } from "@/utils/cn";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import CommunityImage from "../community/CommunityImage";

export default function PostMetadata() {
  const { communityName, postId, username } = useParams();

  const hydrated = useHydration();
  const state = usePostContext();

  return (
    <>
      <div className="flex items-center text-xs">
        {/* checks if the post component is rendered by the community page */}
        {!communityName && (
          <>
            <Link
              href={`/r/${state.community.name}`}
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <CommunityImage imageUrl={state.community.imageUrl} size={20} />
              <div className="font-bold hover:underline">
                r/{state.community.name}
              </div>
            </Link>

            <Dot className="size-3 text-zinc-500" />
          </>
        )}

        {/* checks if the post component is rendered by the user page */}
        {!username && (
          <>
            <div className="text-zinc-500">
              Posted by{" "}
              <Link
                href={`/u/${state.author.username}`}
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                u/{state.author.username}
              </Link>
            </div>

            <Dot className="size-3 text-zinc-500" />
          </>
        )}

        {hydrated ? (
          <time
            dateTime={state.createdAt.toISOString()}
            title={state.createdAt.toLocaleDateString("hr-HR")}
            className="text-zinc-500"
          >
            {getRelativeTimeString(state.createdAt)}
          </time>
        ) : (
          <span className="text-zinc-500">Calculating...</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <h2 className={cn("text-lg font-medium", { "text-xl": postId })}>
          {state.title}
        </h2>
        {state.spoiler && (
          <div className="border border-zinc-400 px-1 text-xs text-zinc-400">
            spoiler
          </div>
        )}
        {state.nsfw && (
          <div className="border border-rose-500 px-1 text-xs text-rose-500">
            nsfw
          </div>
        )}
      </div>
    </>
  );
}
