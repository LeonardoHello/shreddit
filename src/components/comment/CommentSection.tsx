"use client";

import { use } from "react";

import { User } from "@clerk/nextjs/server";

import CommentContextProvider from "@/context/CommentContext";
import { RouterOutput } from "@/trpc/routers/_app";
import Comment from "./Comment";
import CommentSectionEmpty from "./CommentSectionEmpty";
import CommentThread from "./CommentThread";

export default function CommentSection({
  currentUserId,
  commentsPromise,
}: {
  currentUserId: User["id"] | null;
  commentsPromise: Promise<RouterOutput["comment"]["getComments"]>;
}) {
  const commentTree = use(commentsPromise);

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
