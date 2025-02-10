import { User } from "@clerk/nextjs/server";

import CommentContextProvider from "@/context/CommentContext";
import { Comment as CommentType } from "@/db/schema/comments";
import { RouterOutput } from "@/trpc/routers/_app";
import Comment from "./Comment";

export default function CommentThread({
  currentUserId,
  commentId,
  replies,
}: {
  currentUserId: User["id"] | null;
  commentId: CommentType["id"];
  replies: RouterOutput["comment"]["getComments"];
}) {
  const currentReplies = replies.filter(
    (reply) => reply.parentCommentId === commentId,
  );

  if (currentReplies.length === 0) {
    return null;
  }

  const filteredReplies = replies.filter(
    (reply) => reply.parentCommentId !== commentId,
  );

  return (
    <div className="flex flex-col gap-2">
      {currentReplies.map((reply) => (
        <CommentContextProvider key={reply.id} comment={reply}>
          <Comment currentUserId={currentUserId}>
            {/* replies */}
            <CommentThread
              currentUserId={currentUserId}
              commentId={reply.id}
              replies={filteredReplies}
            />
          </Comment>
        </CommentContextProvider>
      ))}
    </div>
  );
}
