import { auth } from "@clerk/nextjs";

import Comment from "@/components/Comment";
import { RouterOutput } from "@/trpc/procedures";

export default function Comments({
  comments,
  replies,
}: {
  comments: NonNullable<RouterOutput["getPost"]>["comments"];
  replies: NonNullable<RouterOutput["getPost"]>["comments"];
}) {
  const { userId } = auth();

  return (
    <div className="flex flex-col gap-6">
      {comments
        .toSorted((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map((comment) => (
          <Comment
            key={comment.id}
            currentUserId={userId}
            initialData={comment}
          >
            {/* replies */}
            <Comments
              comments={replies.filter(
                (reply) => reply.parentCommentId === comment.id,
              )}
              replies={replies.filter(
                (reply) => reply.parentCommentId !== comment.id,
              )}
            />
          </Comment>
        ))}
    </div>
  );
}
