"use client";

import { useState } from "react";

import CommentContextProvider from "@/lib/context/CommentContextProvider";
import type { User } from "@/lib/db/schema";
import type { ArrElement } from "@/lib/types";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import CommentContentRTE from "../RTE/CommentContentRTE";
import CommentReplyRTE from "../RTE/CommentReplyRTE";
import CommentActions from "./CommentActions";
import CommentActionsDropdown from "./CommentActionsDropdown";
import CommentMetadata from "./CommentMetadata";

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

  const toggleEdit = () => setEditable((prev) => !prev);
  const cancelEdit = () => setEditable(false);
  const toggleReply = () => setReply((prev) => !prev);
  const cancelReply = () => setReply(false);

  return (
    <CommentContextProvider comment={comment}>
      <div className="flex flex-col gap-2">
        <CommentMetadata />
        <div className="ml-3 flex flex-col gap-4 border-l-2 border-zinc-700/70 pl-2">
          <div className="flex flex-col gap-1 pl-2">
            <CommentContentRTE editable={editable} cancelEdit={cancelEdit} />

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
