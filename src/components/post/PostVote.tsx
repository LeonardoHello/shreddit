"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";

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
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isUpvoted = state.voteStatus === "upvoted";
  const isDownvoted = state.voteStatus === "downvoted";

  return (
    <div
      className={cn("flex items-center gap-0.5 rounded-full bg-secondary", {
        "bg-rose-600": isUpvoted,
        "bg-indigo-500": isDownvoted,
      })}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        variant={"secondary"}
        className={cn("size-8 rounded-full bg-inherit transition", {
          "hover:bg-rose-700": isUpvoted,
          "hover:bg-indigo-600": isDownvoted,
        })}
        onClick={() => {
          votePost.mutate({
            postId: state.id,
            voteStatus: isUpvoted ? "none" : "upvoted",
          });
        }}
      >
        <ArrowBigUp
          className={cn("stroke-[1.2]", {
            "hover:text-rose-600": !isUpvoted && !isDownvoted,
            "fill-foreground": isUpvoted,
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
        variant={"secondary"}
        className={cn("size-8 rounded-full bg-inherit", {
          "hover:bg-rose-700": isUpvoted,
          "hover:bg-indigo-600": isDownvoted,
        })}
        onClick={() => {
          votePost.mutate({
            postId: state.id,
            voteStatus: isDownvoted ? "none" : "downvoted",
          });
        }}
      >
        <ArrowBigDown
          className={cn("stroke-[1.2]", {
            "hover:text-indigo-500": !isUpvoted && !isDownvoted,
            "fill-foreground": isDownvoted,
          })}
        />
      </Button>
    </div>
  );
}
