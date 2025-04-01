import { MessagesSquare } from "lucide-react";

export default function CommentSectionEmpty() {
  return (
    <div className="text-muted-foreground flex h-80 grow flex-col items-center justify-center gap-4 text-center">
      <MessagesSquare className="size-6" />
      <h2 className="text-lg font-medium capitalize">no comments yet</h2>
      <p className="text-sm">Be the first to share what you think!</p>
    </div>
  );
}
