"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { User } from "@/db/schema/users";
import { client } from "@/hono/client";
import { cn } from "@/lib/cn";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { voteStatusDelta } from "@/utils/voteStatusDelta";
import { Button } from "../ui/button";

export default function PostVote({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const router = useRouter();

  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const votePost = useMutation({
    mutationFn: async (voteStatus: NonNullable<typeof state.voteStatus>) => {
      const statusDelta = voteStatusDelta({
        oldStatus: state.voteStatus,
        newStatus: voteStatus,
      });

      await client.users.me.posts[`:postId{${reg}}`].vote.$patch({
        param: { postId: state.id },
        json: { voteStatus, voteCount: state.voteCount + statusDelta },
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
      className={cn("bg-secondary flex items-center rounded-full", {
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
            votePost.mutate(isUpvoted ? "none" : "upvoted");
          } else {
            router.push("/sign-in");
          }
        }}
      >
        <ArrowBigUp
          className={cn("size-6 stroke-[1.2]", {
            "fill-foreground": isUpvoted,
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
        variant="secondary"
        className={cn("size-8 rounded-full bg-inherit", {
          "hover:text-indigo-500": !isUpvoted && !isDownvoted,
          "hover:bg-indigo-600": isDownvoted,
          "hover:bg-rose-700": isUpvoted,
        })}
        onClick={() => {
          if (currentUserId) {
            votePost.mutate(isDownvoted ? "none" : "downvoted");
          } else {
            router.push("/sign-in");
          }
        }}
      >
        <ArrowBigDown
          className={cn("size-6 stroke-[1.2]", {
            "fill-foreground": isDownvoted,
          })}
        />
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  );
}
