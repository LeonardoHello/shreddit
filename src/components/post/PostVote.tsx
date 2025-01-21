"use client";

import { useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
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

export default function PostVote({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const clerk = useClerk();

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
      className={cn("flex items-center rounded-full bg-secondary", {
        "bg-rose-600": isUpvoted,
        "bg-indigo-500": isDownvoted,
      })}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        variant="secondary"
        className={cn("size-8 rounded-full bg-inherit", {
          "hover:text-rose-600": !isUpvoted && !isDownvoted,
          "hover:bg-rose-700": isUpvoted,
          "hover:bg-indigo-600": isDownvoted,
        })}
        onClick={() => {
          if (currentUserId) {
            votePost.mutate({
              postId: state.id,
              voteStatus: isUpvoted ? "none" : "upvoted",
            });
          } else {
            clerk.openSignIn();
          }
        }}
      >
        <ArrowBigUp
          className={cn("stroke-[1.2]", {
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
        variant="secondary"
        className={cn("size-8 rounded-full bg-inherit", {
          "hover:text-indigo-500": !isUpvoted && !isDownvoted,
          "hover:bg-indigo-600": isDownvoted,
          "hover:bg-rose-700": isUpvoted,
        })}
        onClick={() => {
          if (currentUserId) {
            votePost.mutate({
              postId: state.id,
              voteStatus: isDownvoted ? "none" : "downvoted",
            });
          } else {
            clerk.openSignIn();
          }
        }}
      >
        <ArrowBigDown
          className={cn("stroke-[1.2]", {
            "fill-foreground": isDownvoted,
          })}
        />
      </Button>
    </div>
  );
}
