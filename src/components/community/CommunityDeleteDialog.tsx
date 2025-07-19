import { useRouter } from "next/navigation";

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
import { Community } from "@/db/schema/communities";
import { useTRPC } from "@/trpc/client";

export default function CommunityDeleteDialog({
  communityId,
}: {
  communityId: Community["id"];
}) {
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteCommunity = useMutation(
    trpc.community.deleteCommunity.mutationOptions({
      onMutate: () => {
        router.replace("/");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.community.getJoinedCommunities.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.community.getModeratedCommunities.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.community.getMutedCommunities.queryKey(),
        });

        toast.success("Community deleted successfully.");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to delete your community. Please try again later.");
      },
    }),
  );

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          community and remove all associated data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            deleteCommunity.mutate(communityId);
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
