import Image from "next/image";
import Link from "next/link";

import useHydration from "@/lib/hooks/useHydration";
import type { InfiniteQueryPost } from "@/lib/types";
import getRelativeTimeString from "@/lib/utils/getRelativeTimeString";
import communityImage from "@/public/community-logo.svg";
import dot from "@/public/dot.svg";

export default function PostMetadata({ post }: { post: InfiniteQueryPost }) {
  const hydrated = useHydration();

  return (
    <>
      <div className="flex items-center gap-1 text-xs">
        <Link
          href={`/r/${post.community.name}`}
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {post.community.imageUrl ? (
            <Image
              src={post.community.imageUrl}
              alt="community image"
              width={20}
              height={20}
              className="select-none rounded-full"
            />
          ) : (
            <Image
              src={communityImage}
              alt="community image"
              width={20}
              height={20}
              className="select-none rounded-full border border-zinc-300 bg-zinc-300"
            />
          )}
          <div className="font-bold hover:underline">
            r/{post.community.name}
          </div>
        </Link>
        <Image src={dot} alt="dot" height={2} width={2} />
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
        <h2 className="text-lg font-medium">{post.title}</h2>
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
