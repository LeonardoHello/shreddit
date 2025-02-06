"use client";

import { useTransition } from "react";

import { Ellipsis, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";

export default function CommentDropdown() {
  const [isPending, startTransition] = useTransition();

  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const utils = trpc.useUtils();

  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      startTransition(async () => {
        await Promise.all([
          utils.post.getPost.invalidate(state.postId),
          utils.comment.getComments.invalidate(state.postId),
        ]);
      });

      toast.success("Comment deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMutating = isPending || deleteComment.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <Ellipsis className="size-4 stroke-[2.5]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded bg-card"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem
          onClick={() => {
            dispatch({ type: ReducerAction.TOGGLE_EDIT });
          }}
        >
          <Pencil className="size-4" />
          <span>Edit comment</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (!isMutating) {
              deleteComment.mutate(state.id);
            }
          }}
        >
          <Trash />
          <span>Delete comment</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
