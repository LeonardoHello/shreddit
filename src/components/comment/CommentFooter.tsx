import Link from "next/link";

import { MessageCircle } from "lucide-react";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { User } from "@/db/schema/users";
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

  return (
    <div className="text-muted-foreground flex items-center">
      <CommentVote currentUserId={currentUserId} />

      <Button
        size="sm"
        variant={"ghost"}
        className="size-8 gap-1.5 rounded-full sm:w-auto"
        disabled={!currentUserId}
        onClick={() => {
          if (currentUserId) {
            dispatch({ type: ReducerAction.TOGGLE_REPLY });
          }
        }}
        asChild
      >
        <Link href={"/sign-in"}>
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline-block">Reply</span>
        </Link>
      </Button>

      {currentUserId === state.authorId && (
        <CommentDropdown>
          <CommentDeleteDialog />
        </CommentDropdown>
      )}
    </div>
  );
}
