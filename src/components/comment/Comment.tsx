"use client";

import { useCommentContext } from "@/context/CommentContext";
import type { User } from "@/db/schema/users";
import RTECommentReply from "../RTE/RTECommentReply";
import CommentBody from "./CommentBody";
import CommentFooter from "./CommentFooter";
import CommentHeader from "./CommentHeader";

export default function Comment({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: User["id"] | null;
}) {
  const state = useCommentContext();

  return (
    <div className="flex flex-col gap-2">
      <CommentHeader />

      <div className="ml-3 flex flex-col gap-2 border-l-2 border-zinc-700/70 pl-4">
        <div>
          <CommentBody />
          <CommentFooter currentUserId={currentUserId} />
        </div>

        {/* create reply */}
        {state.isReplying && <RTECommentReply />}

        {/* Replies */}
        {children}
      </div>
    </div>
  );
}
