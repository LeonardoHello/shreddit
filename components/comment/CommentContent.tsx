import { useCommentContext } from "@/lib/context/CommentContextProvider";

import CommentEditRTE from "../RTE/CommentEditRTE";

export default function CommentContent() {
  const { comment, editable } = useCommentContext();

  if (editable) {
    return <CommentEditRTE />;
  }

  return (
    <div
      className="prose prose-sm prose-zinc prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: comment.text }}
    />
  );
}
