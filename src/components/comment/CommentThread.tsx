import type { InferResponseType } from "hono";

import CommentContextProvider from "@/context/CommentContext";
import { Comment as CommentType } from "@/db/schema/comments";
import { User } from "@/db/schema/users";
import type { client } from "@/hono/client";
import Comment from "./Comment";

type Replies = InferResponseType<
  (typeof client.posts)[":postId{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}}"]["comments"]["$get"],
  200
>;

export default function CommentThread({
  currentUserId,
  commentId,
  replies,
}: {
  currentUserId: User["id"] | null;
  commentId: CommentType["id"];
  replies: Replies;
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
