"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";

export default function CommentVote() {
  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const voteComment = trpc.comment.voteComment.useMutation({
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

  const isUpvoted = state.voteStatus === "upvoted";
  const isDownvoted = state.voteStatus === "downvoted";

  return (
    <div
      className="flex items-center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        variant="ghost"
        className="size-8 rounded-full hover:text-rose-600"
        onClick={() => {
          voteComment.mutate({
            commentId: state.id,
            voteStatus: isUpvoted ? "none" : "upvoted",
          });
        }}
      >
        <ArrowBigUp
          className={cn("stroke-[1.2]", {
            "fill-rose-600 text-rose-600": isUpvoted,
          })}
        />
      </Button>

      <div className="text-xs font-bold">
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(state.voteCount)}
      </div>

      <Button
        variant="ghost"
        className="size-8 rounded-full hover:text-indigo-500"
        onClick={() => {
          voteComment.mutate({
            commentId: state.id,
            voteStatus: isDownvoted ? "none" : "downvoted",
          });
        }}
      >
        <ArrowBigDown
          className={cn("stroke-[1.2]", {
            "fill-indigo-500 text-indigo-500": isDownvoted,
          })}
        />
      </Button>
    </div>
  );
}
