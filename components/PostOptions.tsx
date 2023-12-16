import Link from "next/link";

import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import cn from "@/lib/utils/cn";
import type { RouterInput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";
import type {
  InfinteQueryInfo,
  InfinteQueryPost,
  InfinteQueryPostsProcedure,
} from "@/types";

type Props<T extends InfinteQueryPostsProcedure> = {
  post: InfinteQueryPost;
  queryInfo: InfinteQueryInfo<T>;
};

export default function PostOptions<T extends InfinteQueryPostsProcedure>({
  post,
  queryInfo,
}: Props<T>) {
  const utils = trpc.useUtils();

  const onError = async ({ message }: { message: string }) => {
    toast.error(message);
    await utils["posts"][queryInfo.procedure].refetch(
      queryInfo.input,
      {},
      { throwOnError: true },
    );
  };

  const onMutate = async (
    variables: RouterInput["post"]["tagSpoiler" | "tagNsfw"],
  ) => {
    await utils["posts"][queryInfo.procedure].cancel();

    utils["posts"][queryInfo.procedure].setInfiniteData(
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
              if (_post.id !== variables.id) return _post;

              return { ..._post, ...variables };
            }),
          })),
        };
      },
    );

    if ("spoiler" in variables) {
      if (variables.spoiler) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    } else {
      if (variables.nsfw) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    }
  };

  const updateSpoilerTag = trpc.post.tagSpoiler.useMutation({
    onError,
    onMutate,
  });

  const updateNSFWTag = trpc.post.tagNsfw.useMutation({
    onError,
    onMutate,
  });

  const deletedPost = trpc.post.delete.useMutation({
    onError,
    onMutate: async () => {
      await utils["posts"][queryInfo.procedure].cancel();

      utils["posts"][queryInfo.procedure].setInfiniteData(
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
              posts: page.posts.filter((_post) => _post.id !== post.id),
            })),
          };
        },
      );

      toast.success("Post deleted successfully.");
    },
  });

  return (
    <div className="absolute z-10 flex w-48 flex-col border border-zinc-700/70 bg-zinc-900 text-sm font-medium shadow-[0_2px_4px_0] shadow-zinc-300/20">
      {post.files.length === 0 && (
        <Link
          href={`/r/${post.community.name}/comments/${post.id}/edit`}
          className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        >
          <PencilSquareIcon className="h-5 w-5" /> Edit
        </Link>
      )}

      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (deletedPost.isLoading) return;

          deletedPost.mutateAsync(post.id);
        }}
      >
        <TrashIcon className="h-5 w-5" /> Delete
      </div>
      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.preventDefault();

          if (updateSpoilerTag.isLoading) return;

          updateSpoilerTag.mutate({
            id: post.id,
            spoiler: !post.spoiler,
          });
        }}
      >
        <CheckIcon
          className={cn(
            "h-5 w-5 rounded-sm border-2 border-zinc-600 stroke-2",
            { "stroke-transparent": !post.spoiler },
          )}
        />{" "}
        Mark As Spoiler
      </div>
      <div
        className="flex items-center gap-2 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.preventDefault();

          if (updateNSFWTag.isLoading) return;

          updateNSFWTag.mutate({
            id: post.id,
            nsfw: !post.nsfw,
          });
        }}
      >
        <CheckIcon
          className={cn(
            "h-5 w-5 rounded-sm border-2 border-zinc-600 stroke-2",
            { "stroke-transparent": !post.nsfw },
          )}
        />{" "}
        Mark As NSFW
      </div>
    </div>
  );
}
