import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { useTRPC } from "@/trpc/client";

export default function FeedPostHidden() {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const trpc = useTRPC();

  const hidePost = useMutation(
    trpc.post.hidePost.mutationOptions({
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
        console.error(error);
        toast.error(
          "Failed to hide the post. Please try refreshing the page or try again later.",
        );
      },
    }),
  );

  return (
    <div className="bg-card hover:border-ring/50 flex h-20 items-center justify-between gap-3 rounded border p-4">
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
