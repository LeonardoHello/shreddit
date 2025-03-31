"use client";

import { User } from "@clerk/nextjs/server";
import { useSuspenseQuery } from "@tanstack/react-query";

import CommentContextProvider from "@/context/CommentContext";
import { useTRPC } from "@/trpc/client";
import Comment from "./Comment";
import CommentSectionEmpty from "./CommentSectionEmpty";
import CommentThread from "./CommentThread";

export default function CommentSection({
  currentUserId,
  postId,
}: {
  currentUserId: User["id"] | null;
  postId: string;
}) {
  const trpc = useTRPC();

  const { data: commentTree } = useSuspenseQuery(
    trpc.comment.getComments.queryOptions(postId),
  );

  if (commentTree.length === 0) return <CommentSectionEmpty />;

  const comments = commentTree.filter((comment) => !comment.parentCommentId);
  const replies = commentTree.filter((comment) => comment.parentCommentId);

  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <CommentContextProvider key={comment.id} comment={comment}>
          <Comment currentUserId={currentUserId}>
            {/* Replies */}
            <CommentThread
              currentUserId={currentUserId}
              commentId={comment.id}
              replies={replies}
            />
          </Comment>
        </CommentContextProvider>
      ))}
    </div>
  );
}
