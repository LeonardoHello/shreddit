import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { UserToPost } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";
import { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";
import type { ArrElement } from "@/types";

type Props = {
  post: ArrElement<RouterOutput["joinedCommunitiesPosts"]["posts"]>;
  userId: string | null | undefined;
};

export default function Vote({ post, userId }: Props) {
  const utils = trpc.useUtils();

  const onSuccess = async (_data: UserToPost[]) => {
    await utils.joinedCommunitiesPosts.cancel();

    const userToPost = _data[0];

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
            if (_post.id !== post.id) return _post;

            let usersToPosts = structuredClone(_post.usersToPosts);

            const index = usersToPosts.findLastIndex(
              (userToPost) => userToPost.userId === userId,
            );

            if (index === -1) {
              usersToPosts.push(userToPost);
            } else {
              usersToPosts = usersToPosts.with(index, userToPost);
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

  const upvote = trpc.upvotePost.useMutation({
    onError: ({ message }) => {
      toast.error(message);
    },
    onSuccess,
  });
  const downvote = trpc.downvotePost.useMutation({
    onError: ({ message }) => {
      toast.error(message);
    },
    onSuccess,
  });

  const userToPost = post.usersToPosts.find(
    (userToPost) => userToPost.userId === userId,
  );

  const upvoteCount = post.usersToPosts.reduce((a, b) => {
    return b.upvoted ? a + 1 : b.downvoted ? a - 1 : a;
  }, 0);

  return (
    <div className="flex flex-col gap-0.5 items-center text-zinc-500 select-none">
      <ArrowUpCircleIcon
        className={cn("h-8 w-8 hover:bg-zinc-700/50 rounded ", {
          "text-rose-500": userToPost?.upvoted,
        })}
        onClick={(e) => {
          e.preventDefault();

          upvote.mutate({
            postId: post.id,
            upvoted: userToPost ? !userToPost.upvoted : true,
          });
        }}
      />
      <div
        className={cn("text-xs font-bold text-zinc-300", {
          "text-rose-500": userToPost?.upvoted,
          "text-blue-500": userToPost?.downvoted,
        })}
      >
        {upvoteCount}
      </div>
      <ArrowDownCircleIcon
        className={cn("h-8 w-8 hover:bg-zinc-700/50 rounded ", {
          "text-blue-500": userToPost?.downvoted,
        })}
        onClick={(e) => {
          e.preventDefault();

          downvote.mutate({
            postId: post.id,
            downvoted: userToPost ? !userToPost.downvoted : true,
          });
        }}
      />
    </div>
  );
}
