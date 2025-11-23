import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { client } from "@/hono/client";
import { uuidv4PathRegex as reg } from "@/utils/hono";

export default function FeedPostHidden() {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const hidePost = useMutation({
    mutationFn: async () => {
      const res = await client.posts[`:postId{${reg}}`].hide.$patch({
        param: { postId: state.id },
        json: { hidden: false },
      });

      return res.json();
    },
    onMutate: () => {
      const previousValue = state.isHidden;

      dispatch({
        type: ReducerAction.SET_HIDE,
        hide: false,
      });

      return { previousValue };
    },
    onSuccess: (data) => {
      if (data[0].hidden) {
        toast.success("Post hidden successfully.");
      } else {
        toast.success("Post unhidden successfully.");
      }
    },
    onError: (error, _variables, context) => {
      dispatch({
        type: ReducerAction.SET_HIDE,
        hide: context?.previousValue ?? false,
      });

      console.error(error);
      toast.error("Failed to hide the post. Please try again later.");
    },
  });

  return (
    <div className="bg-card hover:border-ring/50 flex h-20 items-center justify-between gap-3 rounded border p-4">
      <div className="font-semibold capitalize">post hidden</div>
      <button
        className="rounded-full bg-zinc-800 px-4 py-2"
        onClick={() => {
          hidePost.mutate();
        }}
      >
        Undo
      </button>
    </div>
  );
}
