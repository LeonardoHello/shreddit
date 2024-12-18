import { useCommentContext } from "@/context/CommentContext";
import RTECommentEdit from "../RTE/RTECommentEdit";

export default function CommentContent() {
  const { comment, editable } = useCommentContext();

  if (editable) {
    return <RTECommentEdit />;
  }

  return (
    <div
      className="prose prose-sm prose-zinc prose-invert max-w-none break-words"
      dangerouslySetInnerHTML={{ __html: comment.text }}
    />
  );
}
