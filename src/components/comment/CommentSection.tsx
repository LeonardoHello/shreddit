"use client";

import { use } from "react";

import { User } from "@clerk/nextjs/server";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

import type { getComments } from "@/api/getComment";
import CommentContextProvider from "@/context/CommentContext";
import Comment from "./Comment";
import CommentThread from "./CommentThread";

export default function CommentSection({
  currentUserId,
  commentsPromise,
}: {
  currentUserId: User["id"] | null;
  commentsPromise: ReturnType<typeof getComments.execute>;
}) {
  const commentTree = use(commentsPromise);

  if (commentTree.length === 0)
    return (
      <div className="flex min-h-[20rem] grow flex-col items-center justify-center gap-4 text-center text-zinc-500">
        <ChatBubbleLeftRightIcon className="size-6" />
        <h2 className="text-lg font-medium capitalize">no comments yet</h2>
        <p className="text-sm">Be the first to share what you think!</p>
      </div>
    );

  const comments = commentTree.filter((comment) => !comment.parentCommentId);
  const replies = commentTree.filter((comment) => comment.parentCommentId);

  return (
    <div className="flex grow flex-col gap-6 bg-zinc-900">
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <CommentContextProvider
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
          >
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
    </div>
  );
}
