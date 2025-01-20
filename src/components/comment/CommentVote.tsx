"use client";

import { useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
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

export default function CommentVote({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const clerk = useClerk();

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
          if (currentUserId) {
            voteComment.mutate({
              commentId: state.id,
              voteStatus: isUpvoted ? "none" : "upvoted",
            });
          } else {
            clerk.openSignIn();
          }
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
          if (currentUserId) {
            voteComment.mutate({
              commentId: state.id,
              voteStatus: isDownvoted ? "none" : "downvoted",
            });
          } else {
            clerk.openSignIn();
          }
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
