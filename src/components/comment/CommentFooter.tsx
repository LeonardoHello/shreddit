import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const isAuthor = state.authorId === currentUserId;
  const isCommunityModerator =
    state.post.community.moderatorId === currentUserId;

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
          } else {
            router.push("/sign-in");
          }
        }}
      >
        <MessageCircle className="size-4" />
        <span className="hidden sm:inline-block">Reply</span>
      </Button>

      {(isAuthor || isCommunityModerator) && (
        <CommentDropdown isAuthor={isAuthor}>
          <CommentDeleteDialog />
        </CommentDropdown>
      )}
    </div>
  );
}
