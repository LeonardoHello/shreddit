import { useRouter } from "next/navigation";

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
import { trpc } from "@/trpc/client";

export default function CommunityDeleteDialog({
  communityId,
}: {
  communityId: string;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const deleteCommunity = trpc.community.deleteCommunity.useMutation({
    onMutate: () => {
      router.replace("/");
    },
    onSuccess: () => {
      utils.community.getJoinedCommunities.invalidate();
      utils.community.getModeratedCommunities.invalidate();
      utils.community.getMutedCommunities.invalidate();

      toast.success("Community deleted successfully.");
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
