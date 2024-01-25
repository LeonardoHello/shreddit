"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import CommentContextProvider from "@/lib/context/CommentContextProvider";
import type { User } from "@/lib/db/schema";
import useHydration from "@/lib/hooks/useHydration";
import type { ArrElement } from "@/lib/types";
import getRelativeTimeString from "@/lib/utils/getRelativeTimeString";
import dot from "@/public/dot.svg";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import CommentEditRTE from "../RTE/CommentEditRTE";
import CommentReplyRTE from "../RTE/CommentReplyRTE";
import CommentActions from "./CommentActions";
import CommentActionsDropdown from "./CommentActionsDropdown";

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

  const [reply, setReply] = useState(false);
  const [editable, setEditable] = useState(false);

  const hydrated = useHydration();

  const toggleEdit = () => setEditable((prev) => !prev);
  const cancelEdit = () => setEditable(false);
  const toggleReply = () => setReply((prev) => !prev);
  const cancelReply = () => setReply(false);

  return (
    <CommentContextProvider comment={comment}>
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
            <CommentEditRTE editable={editable} cancelEdit={cancelEdit} />

            <CommentActions
              currentUserId={currentUserId}
              toggleReply={toggleReply}
            >
              <CommentActionsDropdown toggleEdit={toggleEdit} />
            </CommentActions>
          </div>
          {reply && (
            <div className="ml-3 border-l-2 border-zinc-700/70 pl-6">
              <CommentReplyRTE cancelReply={cancelReply} />
            </div>
          )}

          {/* Replies */}
          {children}
        </div>
      </div>
    </CommentContextProvider>
  );
}
