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
import { Community } from "@/db/schema/communities";
import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";

export default function CommunityDeleteDialog({
  communityId,
}: {
  communityId: Community["id"];
}) {
  const router = useRouter();

  const queryClient = getQueryClient();

  const deleteCommunity = useMutation({
    mutationFn: async () => {
      await client.communities[`:communityId{${reg}}`].$delete({
        param: { communityId },
      });
    },
    onMutate: () => {
      router.replace("/");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "moderated"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "joined"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "muted"],
      });

      toast.success("Community deleted successfully.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete your community. Please try again later.");
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
            deleteCommunity.mutate();
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
