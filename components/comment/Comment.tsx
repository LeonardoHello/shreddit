"use client";

import CommentContextProvider from "@/lib/context/CommentContextProvider";
import type { User } from "@/lib/db/schema";
import { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import CommentReplyRTE from "../RTE/CommentReplyRTE";
import CommentActions from "./CommentActions";
import CommentActionsDropdown from "./CommentActionsDropdown";
import CommentContent from "./CommentContent";
import CommentMetadata from "./CommentMetadata";

type Props = {
  currentUserId: User["id"] | null;
  initialData: NonNullable<RouterOutput["getComment"]>;
  children: React.ReactNode;
};

export default function Comment({
  currentUserId,
  initialData,
  children,
}: Props) {
  const { data: comment } = trpc.getComment.useQuery(initialData.id, {
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (!comment) throw new Error("Couldn't fetch comment information");

  return (
    <CommentContextProvider comment={comment}>
      <div className="flex flex-col gap-2">
        <CommentMetadata />
        <div className="ml-3 flex flex-col gap-4 border-l-2 border-zinc-700/70 pl-2">
          <div className="flex flex-col gap-1 pl-2">
            <CommentContent />

            <CommentActions currentUserId={currentUserId}>
              <CommentActionsDropdown />
            </CommentActions>
          </div>

          {/* create comment */}
          <CommentReplyRTE />

          {/* Replies */}
          {children}
        </div>
      </div>
    </CommentContextProvider>
  );
}
