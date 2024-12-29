import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { trpc } from "@/trpc/client";

export default function FeedPostHidden() {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const hidePost = trpc.hidePost.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.SET_HIDE,
        hide: variables.hidden,
      });
    },
    onSuccess: (data) => {
      if (data[0].hidden) {
        toast.success("Post hidden successfully.");
      } else {
        toast.success("Post unhidden successfully.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="flex h-20 items-center justify-between gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-4 hover:border-zinc-500">
      <div className="font-semibold capitalize">post hidden</div>
      <button
        className="rounded-full bg-zinc-800 px-4 py-2"
        onClick={() => {
          hidePost.mutate({ postId: state.id, hidden: false });
        }}
      >
        Undo
      </button>
    </div>
  );
}
