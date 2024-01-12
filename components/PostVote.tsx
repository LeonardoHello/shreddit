import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import type { UserToPost } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";
import { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

type Props = {
  currentUserId: UserToPost["userId"] | null;
  post: NonNullable<RouterOutput["getPost"]>;
};

const PostVote = function PostVote({ currentUserId, post }: Props) {
  const utils = trpc.useUtils();

  const userToPost = post.usersToPosts.findLast(
    (userToPost) => userToPost.userId === currentUserId,
  );

  const votePost = trpc.votePost.useMutation({
    onMutate: async (variables) => {
      if (!currentUserId) return;

      await utils["getPost"].cancel();

      utils["getPost"].setData(post.id, (data) => {
        if (!data) {
          toast.error("Oops, it seemes that data can't be loaded.");

          return post;
        }

        let usersToPosts = structuredClone(data.usersToPosts);

        if (!userToPost) {
          usersToPosts.push({
            userId: currentUserId,
            saved: false,
            hidden: false,
            ...variables,
          });
        } else {
          const index = usersToPosts.findLastIndex(
            (_userToPost) => _userToPost.userId === currentUserId,
          );

          usersToPosts = usersToPosts.with(index, {
            ...userToPost,
            ...variables,
          });
        }

        return {
          ...data,
          usersToPosts,
        };
      });
    },
    onError: async ({ message }) => {
      if (message !== "UNAUTHORIZED") {
        await utils["getPost"].refetch(post.id, {}, { throwOnError: true });
      }

      toast.error(message);
    },
  });

  const votes = post.usersToPosts.reduce((accumulator, currentValue) => {
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
    <div className="flex select-none flex-col items-center gap-0.5 text-zinc-500">
      <ArrowUpCircleIcon
        className={cn(
          "h-8 w-8 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-rose-500": userToPost?.voteStatus === "upvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          votePost.mutate({
            postId: post.id,
            voteStatus:
              userToPost?.voteStatus === "upvoted" ? "none" : "upvoted",
          });
        }}
      />
      <div
        className={cn("text-xs font-bold text-zinc-300 transition-colors", {
          "text-rose-500": userToPost?.voteStatus === "upvoted",
          "text-blue-500": userToPost?.voteStatus === "downvoted",
        })}
      >
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(votes)}
      </div>
      <ArrowDownCircleIcon
        className={cn(
          "h-8 w-8 cursor-pointer rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-blue-500": userToPost?.voteStatus === "downvoted",
          },
        )}
        onClick={(e) => {
          e.stopPropagation();

          votePost.mutate({
            postId: post.id,
            voteStatus:
              userToPost?.voteStatus === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
};

export default PostVote;
