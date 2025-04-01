import { useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { MessageCircle } from "lucide-react";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { Button } from "../ui/button";
import CommentDeleteDialog from "./CommentDeleteDialog";
import CommentDropdown from "./CommentDropdown";
import CommentVote from "./CommentVote";

export default function CommentFooter({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const clerk = useClerk();

  return (
    <div className="text-muted-foreground flex items-center">
      <CommentVote currentUserId={currentUserId} />

      <Button
        size="sm"
        variant={"ghost"}
        className="size-8 gap-1.5 rounded-full sm:w-auto"
        onClick={() => {
          if (currentUserId) {
            dispatch({ type: ReducerAction.TOGGLE_REPLY });
          } else {
            clerk.openSignIn();
          }
        }}
      >
        <MessageCircle className="size-4" />
        <span className="hidden sm:inline-block">Reply</span>
      </Button>

      {currentUserId === state.authorId && (
        <CommentDropdown>
          <CommentDeleteDialog />
        </CommentDropdown>
      )}
    </div>
  );
}
