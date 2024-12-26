import { useRouter } from "next/navigation";

import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import type { Post } from "@/db/schema";
import { trpc } from "@/trpc/client";
import type { RouterInput } from "@/trpc/routers/_app";
import cn from "@/utils/cn";

export default function PostActionsDropdown({
  removePostFromQuery,
}: {
  removePostFromQuery?: (postId: Post["id"]) => void;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const post = usePostContext();
  const dispatch = usePostDispatchContext();

  const queryConfig = {
    onMutate: async (
      variables: RouterInput["setPostSpoilerTag" | "setPostNSFWTag"],
    ) => {
      await utils["getPost"].cancel();

      utils["getPost"].setData(post.id, (data) => {
        if (!data) {
          toast.error("Oops, it seemes that data can't be loaded.");

          return post;
        }

        return { ...data, ...variables };
      });
    },
    onError: async ({ message }: { message: string }) => {
      if (message !== "UNAUTHORIZED") {
        await utils["getPost"].refetch(post.id, {}, { throwOnError: true });
      }

      toast.error(message);
    },
  };

  const updateSpoilerTag = trpc.setPostSpoilerTag.useMutation({
    ...queryConfig,
    onSuccess: (data) => {
      if (data[0].spoiler) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    },
  });

  const updateNSFWTag = trpc.setPostNSFWTag.useMutation({
    ...queryConfig,
    onSuccess: (data) => {
      if (data[0].nsfw) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    },
  });

  const deletedPost = trpc.deletePost.useMutation({
    onError: queryConfig.onError,
    onMutate: () => {
      if (removePostFromQuery !== undefined) {
        removePostFromQuery(post.id);
      }
    },
    onSuccess: () => {
      if (removePostFromQuery === undefined) {
        router.replace("/");
      }

      toast.success("Post deleted successfully.");
    },
  });

  return (
    <div
      className={cn(
        "absolute right-4 z-10 flex w-48 flex-col self-end border border-zinc-700/70 bg-zinc-900 text-sm font-medium shadow-[0_2px_4px_0] shadow-zinc-300/20 md:right-auto",
        { "pointer-events-none opacity-40": deletedPost.isPending },
      )}
    >
      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (updateSpoilerTag.isPending) return;

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
        />
        Mark As Spoiler
      </div>

      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (updateNSFWTag.isPending) return;

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
        />
        Mark As NSFW
      </div>

      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          dispatch({ type: ReducerAction.TOGGLE_EDIT });
        }}
      >
        <PencilSquareIcon className="h-5 w-5" /> Edit
      </div>

      <div
        className="flex items-center gap-2 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (deletedPost.isPending) return;

          deletedPost.mutate(post.id);
        }}
      >
        <TrashIcon className="h-5 w-5" /> Delete
      </div>
    </div>
  );
}
