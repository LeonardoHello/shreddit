"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

import type { User } from "@/lib/db/schema";
import useHydration from "@/lib/hooks/useHydration";
import type { ArrElement } from "@/lib/types";
import getRelativeTimeString from "@/lib/utils/getRelativeTimeString";
import dot from "@/public/dot.svg";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import CommentContent from "./CommentContent";
import CommentEditor from "./CommentEditor";
import CommentVote from "./CommentVote";

export default function Comment({
  currentUserId,
  initialData,
  children,
}: {
  currentUserId: User["id"] | null;
  initialData: ArrElement<NonNullable<RouterOutput["getPost"]>["comments"]>;
  children: React.ReactNode;
}) {
  const { data: comment } = trpc.getComment.useQuery(initialData.id, {
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (!comment) throw new Error("Couldn't fetch comment information");

  const [relpy, setRelpy] = useState(false);

  const hydrated = useHydration();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-xs">
        <Link href={`/u/${comment.author.name}`} className="rounded-full">
          <Image
            src={comment.author.imageUrl}
            alt="user background"
            priority
            width={28}
            height={28}
            className="rounded-full"
          />
        </Link>
        <Link
          href={`/u/${comment.author.name}`}
          className="font-medium hover:underline"
        >
          {comment.author.name}
        </Link>

        {comment.authorId === comment.post.authorId && (
          <div className="font-bold uppercase text-blue-500">op</div>
        )}
        <Image src={dot} alt="dot" height={2} width={2} />

        {hydrated ? (
          <time
            dateTime={comment.updatedAt.toISOString()}
            title={comment.updatedAt.toLocaleDateString("hr-HR")}
            className="text-zinc-500"
          >
            {getRelativeTimeString(comment.updatedAt)}
          </time>
        ) : (
          <span className="text-zinc-500">Time in progress...</span>
        )}
      </div>
      <div className="ml-3 flex flex-col gap-4 border-l-2 border-zinc-700/70 pl-2">
        <div className="flex flex-col gap-1 pl-2">
          <CommentContent text={comment.text} />
          <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
            <CommentVote comment={comment} currentUserId={currentUserId} />
            <div
              className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-zinc-700/50"
              onClick={() => setRelpy((prev) => !prev)}
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
              <span className="hidden sm:block">Relpy</span>
            </div>
          </div>
        </div>
        {relpy && (
          <div className="ml-3 border-l-2 border-zinc-700/70 pl-6">
            <CommentEditor
              postId={comment.postId}
              parentCommentId={comment.id}
              setReply={setRelpy}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
