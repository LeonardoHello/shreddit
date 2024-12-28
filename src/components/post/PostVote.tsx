"use client";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";

export default function PostVote() {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const votePost = trpc.votePost.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.CHANGE_VOTE,
        nextVote: variables.voteStatus,
      });
    },
    onError: async ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <div className="flex select-none flex-col gap-0.5 text-center text-zinc-500">
      <ArrowUpCircleIcon
        viewBox="2.25 2.25 19.5 19.5"
        className={cn(
          "h-6 w-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-rose-500": state.voted === "upvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          votePost.mutate({
            postId: state.id,
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
        viewBox="2.25 2.25 19.5 19.5"
        className={cn(
          "h-6 w-6 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-blue-500": state.voted === "downvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          votePost.mutate({
            postId: state.id,
            voteStatus: state.voted === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
}
