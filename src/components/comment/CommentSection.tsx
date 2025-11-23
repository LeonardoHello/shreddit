"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import CommentContextProvider from "@/context/CommentContext";
import { User } from "@/db/schema/users";
import { client } from "@/hono/client";
import { uuidv4PathRegex as reg } from "@/utils/hono";
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
  const { data: commentTree } = useSuspenseQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].comments.$get({
        param: { postId },
      });

      return res.json();
    },
  });

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
