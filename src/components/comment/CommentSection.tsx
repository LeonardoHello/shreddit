import { User } from "@clerk/nextjs/server";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

import { getComments } from "@/api/getComment";
import CommentContextProvider from "@/context/CommentContext";
import { Post } from "@/db/schema";
import Comment from "./Comment";
import CommentThread from "./CommentThread";

export default async function CommentSection({
  currentUserId,
  postId,
}: {
  currentUserId: User["id"] | null;
  postId: Post["id"];
}) {
  const commentTree = await getComments.execute({ currentUserId, postId });

  if (commentTree.length === 0)
    return (
      <div className="flex h-80 grow flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <ChatBubbleLeftRightIcon className="size-6" />
        <h2 className="text-lg font-medium capitalize">no comments yet</h2>
        <p className="text-sm">Be the first to share what you think!</p>
      </div>
    );

  const comments = commentTree.filter((comment) => !comment.parentCommentId);
  const replies = commentTree.filter((comment) => comment.parentCommentId);

  return (
    <div className="flex grow flex-col gap-6">
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
    </div>
  );
}
