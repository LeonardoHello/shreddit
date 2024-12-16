"use client";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { useCommentContext } from "@/context/CommentContextProvider";
import { User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";

export default function CommentVote({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const utils = trpc.useUtils();

  const { comment } = useCommentContext();

  const userToComment = comment.usersToComments.find(
    (userToComment) => userToComment.userId === currentUserId,
  );

  const voteComment = trpc.voteComment.useMutation({
    onMutate: async (variables) => {
      if (!currentUserId) return;

      utils.getComment.setData(comment.id, (data) => {
        if (!data) {
          toast.error("Failed to upvote comment.");

          return comment;
        }

        let usersToComments = structuredClone(data.usersToComments);

        if (!userToComment) {
          usersToComments.push({
            userId: currentUserId,
            createdAt: new Date(),
            ...variables,
          });
        } else {
          const index = usersToComments.findLastIndex(
            (_userToComment) => _userToComment.userId === currentUserId,
          );

          usersToComments = usersToComments.with(index, {
            ...userToComment,
            ...variables,
          });
        }

        return {
          ...data,
          usersToComments,
        };
      });
    },
    onError: async ({ message }) => {
      if (message !== "UNAUTHORIZED") {
        await utils["getComment"].refetch(
          comment.postId,
          {},
          { throwOnError: true },
        );
      }

      toast.error(message);
    },
  });

  const votes = comment.usersToComments.reduce((accumulator, currentValue) => {
    return (
      accumulator +
      (currentValue.voteStatus === "upvoted"
        ? 1
        : currentValue.voteStatus === "downvoted"
          ? -1
          : 0)
    );
  }, 0);

  return (
    <div className="flex select-none items-center gap-1 text-zinc-500">
      <ArrowUpCircleIcon
        className={cn(
          "h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-rose-500": userToComment?.voteStatus === "upvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          voteComment.mutate({
            commentId: comment.id,
            voteStatus:
              userToComment?.voteStatus === "upvoted" ? "none" : "upvoted",
          });
        }}
      />
      <div
        className={cn("text-xs font-bold text-zinc-300 transition-colors", {
          "text-rose-500": userToComment?.voteStatus === "upvoted",
          "text-blue-500": userToComment?.voteStatus === "downvoted",
        })}
      >
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(votes)}
      </div>
      <ArrowDownCircleIcon
        className={cn(
          "h-7 w-7 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-blue-500": userToComment?.voteStatus === "downvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          voteComment.mutate({
            commentId: comment.id,
            voteStatus:
              userToComment?.voteStatus === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
}
