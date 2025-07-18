import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useTRPC } from "@/trpc/client";

export default function CommentDeleteDialog() {
  const state = useCommentContext();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteComment = useMutation(
    trpc.comment.deleteComment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comment.getComments.queryKey(state.postId),
        });

        toast.success("Comment deleted successfully.");
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          "Failed to delete your comment. Please try refreshing the page or try again later.",
        );
      },
    }),
  );

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
