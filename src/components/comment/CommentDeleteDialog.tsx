import React from "react";

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
import { trpc } from "@/trpc/client";

export default function CommentDeleteDialog() {
  const state = useCommentContext();

  const utils = trpc.useUtils();

  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      utils.post.getPost.invalidate(state.postId);
      utils.comment.getComments.invalidate(state.postId);

      toast.success("Comment deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
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
            deleteComment.mutate(state.id);
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
