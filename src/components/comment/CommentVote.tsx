"use client";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";

export default function CommentVote() {
  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const voteComment = trpc.voteComment.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.CHANGE_VOTE,
        nextVote: variables.voteStatus,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex select-none items-center gap-1 text-zinc-500">
      <ArrowUpCircleIcon
        className={cn(
          "h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-rose-500": state.voted === "upvoted",
          },
        )}
        onClick={() => {
          voteComment.mutate({
            commentId: state.id,
            voteStatus: state.voted === "upvoted" ? "none" : "upvoted",
          });
        }}
      />
      <div
        className={cn("text-xs font-bold text-zinc-300 transition-colors", {
          "text-rose-500": state.voted === "upvoted",
          "text-blue-500": state.voted === "downvoted",
        })}
      >
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(state.voteCount)}
      </div>
      <ArrowDownCircleIcon
        className={cn(
          "h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-blue-500": state.voted === "downvoted",
          },
        )}
        onClick={() => {
          voteComment.mutate({
            commentId: state.id,
            voteStatus: state.voted === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
}
