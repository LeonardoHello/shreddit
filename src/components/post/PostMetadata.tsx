import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { usePostContext } from "@/context/PostContextProvider";
import useHydration from "@/hooks/useHydration";
import cn from "@/utils/cn";
import getRelativeTimeString from "@/utils/getRelativeTimeString";
import dot from "@public/dot.svg";
import CommunityImage from "../community/CommunityImage";

export default function PostMetadata() {
  const { communityName, postId } = useParams();

  const hydrated = useHydration();
  const { post } = usePostContext();

  return (
    <>
      <div className="flex items-center gap-1 text-xs">
        {!communityName && (
          <Link
            href={`/r/${post.community.name}`}
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <CommunityImage imageUrl={post.community.imageUrl} size={20} />
            <div className="font-bold hover:underline">
              r/{post.community.name}
            </div>
            <Image src={dot} alt="dot" height={2} width={2} />
          </Link>
        )}
        <div className="text-zinc-500">
          Posted by{" "}
          <Link
            href={`/u/${post.author.name}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            u/{post.author.name}
          </Link>{" "}
          {hydrated ? (
            <time
              dateTime={post.createdAt.toISOString()}
              title={post.createdAt.toLocaleDateString("hr-HR")}
            >
              {getRelativeTimeString(post.createdAt)}
            </time>
          ) : (
            "Time in progress..."
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <h2 className={cn("text-lg font-medium", { "text-xl": postId })}>
          {post.title}
        </h2>
        {post.spoiler && (
          <div className="border border-zinc-400 px-1 text-xs text-zinc-400">
            spoiler
          </div>
        )}
        {post.nsfw && (
          <div className="border border-rose-500 px-1 text-xs text-rose-500">
            nsfw
          </div>
        )}
      </div>
    </>
  );
}
