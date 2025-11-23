import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { client } from "@/hono/client";
import { uuidv4PathRegex as reg } from "@/utils/hono";

export default function PostDeleteDialog({
  isPostPage,
}: {
  isPostPage: boolean;
}) {
  const router = useRouter();

  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const deletePost = useMutation({
    mutationFn: async () => {
      await client.posts[`:postId{${reg}}`].$delete({
        param: { postId: state.id },
      });
    },
    onMutate: () => {
      dispatch({ type: ReducerAction.DELETE });
    },
    onSuccess: () => {
      if (isPostPage) {
        router.replace("/");
      }

      toast.success("Post deleted successfully.");
    },
    onError: (error) => {
      dispatch({ type: ReducerAction.RESTORE });

      console.error(error);
      toast.error("Failed to delete your post. Please try again later.");
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your post
          and remove all associated data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            deletePost.mutate();
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
