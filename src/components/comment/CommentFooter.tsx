import { MessageCircle } from "lucide-react";

import {
  ReducerAction,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { Button } from "../ui/button";

export default function CommentFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useCommentDispatchContext();

  return (
    <div className="flex items-center text-muted-foreground">
      <Button
        size="sm"
        variant={"ghost"}
        className="order-2 size-8 gap-1.5 rounded-full sm:w-auto"
        onClick={() => {
          dispatch({ type: ReducerAction.TOGGLE_REPLY });
        }}
      >
        <MessageCircle className="size-4" />
        <span className="hidden sm:inline-block">Reply</span>
      </Button>

      {children}
    </div>
  );
}
