"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  useCommentContext,
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { UserToComment } from "@/db/schema/comments";
import { User } from "@/db/schema/users";
import { client } from "@/hono/client";
import { cn } from "@/lib/cn";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { Button } from "../ui/button";

export default function CommentVote({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const router = useRouter();

  const state = useCommentContext();
  const dispatch = useCommentDispatchContext();

  const voteComment = useMutation({
    mutationFn: async (voteStatus: UserToComment["voteStatus"]) => {
      await client.users.me.comments[`:commentId{${reg}}`].vote.$patch({
        param: { commentId: state.id },
        json: { voteStatus },
      });
    },
    onMutate: (variables) => {
      const previousValue = state.voteStatus;

      dispatch({
        type: ReducerAction.SET_VOTE,
        vote: variables,
      });

      return { previousValue };
    },
    onError: (error, _variables, context) => {
      dispatch({
        type: ReducerAction.SET_VOTE,
        vote: context?.previousValue ?? "none",
      });

      console.error(error);
      toast.error("Failed to update your vote. Please try again later.");
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
            voteComment.mutate(isUpvoted ? "none" : "upvoted");
          } else {
            router.push("/sign-in");
          }
        }}
      >
        <ArrowBigUp
          className={cn("size-6 stroke-[1.2]", {
            "fill-rose-600 text-rose-600": isUpvoted,
          })}
        />
        <span className="sr-only">Upvote</span>
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
            voteComment.mutate(isDownvoted ? "none" : "downvoted");
          } else {
            router.push("/sign-in");
          }
        }}
      >
        <ArrowBigDown
          className={cn("size-6 stroke-[1.2]", {
            "fill-indigo-500 text-indigo-500": isDownvoted,
          })}
        />
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  );
}
