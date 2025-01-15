"use client";

import { useCommentContext } from "@/context/CommentContext";
import type { User } from "@/db/schema";
import RTECommentReply from "../RTE/RTECommentReply";
import CommentActions from "./CommentActions";
import CommentActionsDropdown from "./CommentActionsDropdown";
import CommentActionsPlaceholder from "./CommentActionsPlaceholder";
import CommentContent from "./CommentContent";
import CommentMetadata from "./CommentMetadata";

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
      <CommentMetadata />
      <div className="ml-3 flex flex-col gap-4 border-l-2 border-zinc-700/70 pl-4">
        <div className="flex flex-col gap-1">
          <CommentContent />

          {currentUserId && (
            <CommentActions currentUserId={currentUserId}>
              <CommentActionsDropdown />
            </CommentActions>
          )}
          {!currentUserId && <CommentActionsPlaceholder />}
        </div>

        {/* create reply */}
        {state.isReplying && <RTECommentReply />}

        {/* Replies */}
        {children}
      </div>
    </div>
  );
}
