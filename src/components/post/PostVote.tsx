"use client";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";

export default function PostVote() {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const votePost = trpc.post.votePost.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.SET_VOTE,
        vote: variables.voteStatus,
      });
    },
    onError: async ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <div className="flex select-none flex-col gap-0.5 text-center text-muted-foreground">
      <ArrowUpCircle
        className={cn(
          "size-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-rose-500": state.voteStatus === "upvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          votePost.mutate({
            postId: state.id,
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
      <ArrowDownCircle
        className={cn(
          "size-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-blue-500": state.voteStatus === "downvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          votePost.mutate({
            postId: state.id,
            voteStatus: state.voteStatus === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
}
