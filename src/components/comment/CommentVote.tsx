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
        type: ReducerAction.SET_VOTE,
        vote: variables.voteStatus,
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
            "text-rose-500": state.voteStatus === "upvoted",
          },
        )}
        onClick={() => {
          voteComment.mutate({
            commentId: state.id,
            voteStatus: state.voteStatus === "upvoted" ? "none" : "upvoted",
          });
        }}
      />
      <div
        className={cn("text-xs font-bold text-zinc-300 transition-colors", {
          "text-rose-500": state.voteStatus === "upvoted",
          "text-blue-500": state.voteStatus === "downvoted",
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
            "text-blue-500": state.voteStatus === "downvoted",
          },
        )}
        onClick={() => {
          voteComment.mutate({
            commentId: state.id,
            voteStatus: state.voteStatus === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
}
