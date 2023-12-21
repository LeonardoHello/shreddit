import { memo } from "react";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import type { UserToPost } from "@/lib/db/schema";
import type {
  InfiniteQueryPost,
  InfiniteQueryPostProcedure,
  QueryInfo,
} from "@/lib/types";
import cn from "@/lib/utils/cn";
import type { RouterInput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

type Props<T extends InfiniteQueryPostProcedure> = {
  currentUserId: UserToPost["userId"] | null;
  postId: UserToPost["postId"];
  usersToPosts: InfiniteQueryPost["usersToPosts"];
  queryInfo: QueryInfo<T>;
};

const PostVote = memo(function PostVote<T extends InfiniteQueryPostProcedure>({
  usersToPosts,
  currentUserId,
  postId,
  queryInfo,
}: Props<T>) {
  const utils = trpc.useUtils();

  const userToPost = usersToPosts.findLast(
    (userToPost) => userToPost.userId === currentUserId,
  );

  const votes = usersToPosts.reduce((accumulator, currentValue) => {
    return (
      accumulator +
      (currentValue.voteStatus === "upvoted"
        ? 1
        : currentValue.voteStatus === "downvoted"
        ? -1
        : 0)
    );
  }, 0);

  const onError = async ({ message }: { message: string }) => {
    await utils["infiniteQueryPosts"][queryInfo.procedure].refetch(
      queryInfo.input,
      {},
      { throwOnError: true },
    );

    toast.error(message);
  };

  const onMutate = async (variables: RouterInput["votePost"]) => {
    if (!currentUserId) return;

    await utils["infiniteQueryPosts"][queryInfo.procedure].cancel();

    utils["infiniteQueryPosts"][queryInfo.procedure].setInfiniteData(
      queryInfo.input,
      (data) => {
        if (!data) {
          toast.error("Oops, it seemes that data can't be loaded.");

          return {
            pages: [],
            pageParams: [],
          };
        }

        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.map((_post) => {
              if (_post.id !== variables.postId) return _post;

              let usersToPosts = structuredClone(_post.usersToPosts);

              if (!userToPost) {
                usersToPosts.push({
                  hidden: false,
                  saved: false,
                  userId: currentUserId,
                  createdAt: new Date(),
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
                ..._post,
                usersToPosts,
              };
            }),
          })),
        };
      },
    );
  };

  const votePost = trpc.votePost.useMutation({ onError, onMutate });

  return (
    <div className="flex select-none flex-col items-center gap-0.5 text-zinc-500">
      <ArrowUpCircleIcon
        className={cn(
          "h-8 w-8 rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-rose-500": userToPost?.voteStatus === "upvoted",
          },
        )}
        onClick={(e) => {
          e.preventDefault();

          votePost.mutate({
            postId,
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
          "h-8 w-8 rounded transition-colors hover:bg-zinc-700/50",
          {
            "text-blue-500": userToPost?.voteStatus === "downvoted",
          },
        )}
        onClick={(e) => {
          e.preventDefault();

          votePost.mutate({
            postId,
            voteStatus:
              userToPost?.voteStatus === "downvoted" ? "none" : "downvoted",
          });
        }}
      />
    </div>
  );
});

export default PostVote;
