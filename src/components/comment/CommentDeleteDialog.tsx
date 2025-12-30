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
import { useCommentContext } from "@/context/CommentContext";
import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";

export default function CommentDeleteDialog() {
  const state = useCommentContext();

  const queryClient = getQueryClient();

  const deleteComment = useMutation({
    mutationFn: async () => {
      const deleteComment = await client.comments[`:commentId{${reg}}`].$delete(
        {
          param: { commentId: state.id },
          query: {
            postId: state.postId,
            communityId: state.post.communityId,
          },
          json: { commentCount: Math.max(state.post.commentCount - 1, 0) },
        },
      );
      return deleteComment.json();
    },
    onSuccess: () => {
      // TODO: check the right queryKey for getComments query
      queryClient.invalidateQueries({
        queryKey: ["posts", state.postId, "comments"],
      });

      toast.success("Comment deleted successfully.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete your comment. Please try again later.");
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          comment and remove all associated data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            deleteComment.mutate();
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
