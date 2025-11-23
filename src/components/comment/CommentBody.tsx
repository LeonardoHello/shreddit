import { useCommentContext } from "@/context/CommentContext";
import RTECommentEdit from "../RTE/RTECommentEdit";

export default function CommentBody() {
  const state = useCommentContext();

  if (state.isEditing) {
    return <RTECommentEdit />;
  }

  return (
    <div
      className="prose prose-sm prose-zinc prose-invert max-w-none wrap-break-word"
      dangerouslySetInnerHTML={{ __html: state.text }}
    />
  );
}
