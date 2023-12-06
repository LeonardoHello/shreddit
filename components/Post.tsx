import Image from "next/image";
import Link from "next/link";

import {
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import useDropdown from "@/lib/hooks/useDropdown";
import useHydration from "@/lib/hooks/useHydration";
import getRelativeTimeString from "@/lib/utils/getRelativeTimeString";
import communityImage from "@/public/community-logo.svg";
import dot from "@/public/dot.svg";
import type { RouterOutput } from "@/trpc/procedures";
import type { ArrElement } from "@/types";

import PostContent from "./PostContent";
import PostOptions from "./PostOptions";
import Vote from "./Vote";

export default function Post({
  post,
  userId,
}: {
  post: ArrElement<RouterOutput["joinedCommunitiesPosts"]["posts"]>;
  userId: string;
}) {
  const hydrated = useHydration();
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const copyLink = async (communityName: string, postId: string) => {
    const origin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    const path = `r/${communityName}/comments/${postId}`;

    await navigator.clipboard.writeText(`${origin}/${path}`);
    toast.success("Copied link!");
  };

  return (
    <div
      key={post.id}
      className="flex cursor-pointer gap-4 rounded border border-zinc-700/70 bg-zinc-900 p-2 hover:border-zinc-500"
    >
      <Vote post={post} userId={userId} />
      <div className="flex grow flex-col gap-1.5">
        <div className="flex items-center gap-1 text-xs">
          <Link
            href={`r/${post.community.name}`}
            className="flex items-center gap-1"
          >
            {post.community.imageUrl ? (
              <Image
                src={post.community.imageUrl}
                alt="community image"
                width={20}
                height={20}
                className="rounded-full select-none"
              />
            ) : (
              <Image
                src={communityImage}
                alt="community image"
                width={20}
                height={20}
                className="rounded-full border border-zinc-300 bg-zinc-300 select-none"
              />
            )}
            <div className="font-bold">r/{post.community.name}</div>
          </Link>
          <Image src={dot} alt="dot" height={2} width={2} />
          <div className="text-zinc-500">
            Posted by{" "}
            <Link href={`u/${post.author.name}`}>u/{post.author.name}</Link>{" "}
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

        <PostContent post={post} />

        <div className="flex select-none items-center gap-2 text-xs font-bold text-zinc-500">
          <div className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            {post.comments.length} comments
          </div>
          <div
            className="flex items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
            onClick={() => copyLink(post.community.name, post.id)}
          >
            <LinkIcon className="h-6 w-6" />
            Copy Link
          </div>
          {post.authorId === userId && (
            <div ref={dropdownRef} className="relative">
              <EllipsisHorizontalIcon
                className="h-6 w-6 rounded hover:bg-zinc-700/50"
                onClick={() => setIsOpen((prev) => !prev)}
              />
              {isOpen && <PostOptions post={post} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
