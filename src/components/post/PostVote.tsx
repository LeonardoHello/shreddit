"use client";

import Link from "next/link";

import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { User } from "@/db/schema/users";
import { cn } from "@/lib/cn";
import { useTRPC } from "@/trpc/client";
import { Button } from "../ui/button";

export default function PostVote({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const trpc = useTRPC();

  const votePost = useMutation(
    trpc.post.votePost.mutationOptions({
      onMutate: (variables) => {
        dispatch({
          type: ReducerAction.SET_VOTE,
          vote: variables.voteStatus,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

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
            votePost.mutate({
              postId: state.id,
              voteStatus: isUpvoted ? "none" : "upvoted",
            });
          }
        }}
        asChild
      >
        <Link href={"/sign-in"}>
          <ArrowBigUp
            className={cn("stroke-[1.2]", {
              "fill-foreground": isUpvoted,
            })}
          />
          <span className="sr-only">Upvote</span>
        </Link>
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
          }
        }}
        asChild
      >
        <Link href={"/sign-in"}>
          <ArrowBigDown
            className={cn("stroke-[1.2]", {
              "fill-foreground": isDownvoted,
            })}
          />
          <span className="sr-only">Downvote</span>
        </Link>
      </Button>
    </div>
  );
}
