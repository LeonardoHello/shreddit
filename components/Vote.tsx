import { memo } from "react";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { UserToPost } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";
import type { RouterInput, RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";
import { ArrElement } from "@/types";

type Props = {
  usersToPosts: ArrElement<
    RouterOutput["joinedCommunitiesPosts"]["posts"]
  >["usersToPosts"];
  userId: UserToPost["userId"];
  postId: UserToPost["postId"];
};

const Vote = memo(function Vote({ usersToPosts, userId, postId }: Props) {
  const utils = trpc.useUtils();

  const userToPost = usersToPosts.findLast((userToPost) => {
    return userToPost.userId === userId;
  });

  const upvoteCount = usersToPosts.reduce((a, b) => {
    return b.upvoted ? a + 1 : b.downvoted ? a - 1 : a;
  }, 0);

  const onError = async ({ message }: { message: string }) => {
    toast.error(message);
    await utils.joinedCommunitiesPosts.refetch({}, {}, { throwOnError: true });
  };

  const onMutate = async (
    variables: RouterInput["upvotePost" | "downvotePost"],
  ) => {
    await utils.joinedCommunitiesPosts.cancel();

    utils.joinedCommunitiesPosts.setInfiniteData({}, (data) => {
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
                upvoted: false,
                downvoted: false,
                hidden: false,
                saved: false,
                userId,
                ...variables,
              });
            } else {
              const index = usersToPosts.findLastIndex(
                (_userToPost) => _userToPost.userId === userId,
              );

              usersToPosts = usersToPosts.with(index, {
                ...userToPost,
                upvoted: false,
                downvoted: false,
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
    });
  };

  const upvote = trpc.upvotePost.useMutation({ onError, onMutate });
  const downvote = trpc.downvotePost.useMutation({ onError, onMutate });

  return (
    <div className="flex select-none flex-col items-center gap-0.5 text-zinc-500">
      <ArrowUpCircleIcon
        className={cn(
          "h-8 w-8 rounded transition-colors duration-300 hover:bg-zinc-700/50",
          {
            "text-rose-500": userToPost?.upvoted,
          },
        )}
        onClick={(e) => {
          e.preventDefault();

          upvote.mutate({
            postId,
            upvoted: userToPost ? !userToPost.upvoted : true,
          });
        }}
      />
      <div
        className={cn(
          "text-xs font-bold text-zinc-300 transition-colors duration-300",
          {
            "text-rose-500": userToPost?.upvoted,
            "text-blue-500": userToPost?.downvoted,
          },
        )}
      >
        {upvoteCount}
      </div>
      <ArrowDownCircleIcon
        className={cn(
          "h-8 w-8 rounded transition-colors duration-300 hover:bg-zinc-700/50",
          {
            "text-blue-500": userToPost?.downvoted,
          },
        )}
        onClick={(e) => {
          e.preventDefault();

          downvote.mutate({
            postId,
            downvoted: userToPost ? !userToPost.downvoted : true,
          });
        }}
      />
    </div>
  );
});
export default Vote;
