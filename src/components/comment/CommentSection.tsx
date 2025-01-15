import { User } from "@clerk/nextjs/server";

import { getComments } from "@/api/getComment";
import CommentContextProvider from "@/context/CommentContext";
import { Post } from "@/db/schema";
import Comment from "./Comment";
import CommentSectionEmpty from "./CommentSectionEmpty";
import CommentThread from "./CommentThread";

export default async function CommentSection({
  currentUserId,
  postId,
}: {
  currentUserId: User["id"] | null;
  postId: Post["id"];
}) {
  const commentTree = await getComments.execute({ currentUserId, postId });

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
