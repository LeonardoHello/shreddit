import { auth } from "@clerk/nextjs";

import Comment from "@/components/comment/Comment";
import type { getComments } from "@/lib/api/getComment";

type Comments = Awaited<ReturnType<typeof getComments.execute>>;

export default function Comments({
  comments,
  replies,
}: {
  comments: Comments;
  replies: Comments;
}) {
  const { userId } = auth();

  if (comments.length === 0)
    return (
      <div className="flex min-h-[20rem] grow flex-col items-center justify-center gap-4 text-center text-zinc-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="rgba(113,113,122,1)"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M16.8 19L14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path>
        </svg>
        <h2 className="text-lg font-medium capitalize">no comments yet</h2>
        <p className="text-sm">Be the first to share what you think!</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 pb-4">
      {comments
        .toSorted((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map((comment) => (
          <Comment
            key={comment.id}
            currentUserId={userId}
            initialData={comment}
          >
            {/* replies */}
            {replies.some((reply) => reply.parentCommentId === comment.id) ? (
              <Comments
                comments={replies.filter(
                  (reply) => reply.parentCommentId === comment.id,
                )}
                replies={replies.filter(
                  (reply) => reply.parentCommentId !== comment.id,
                )}
              />
            ) : null}
          </Comment>
        ))}
    </div>
  );
}
