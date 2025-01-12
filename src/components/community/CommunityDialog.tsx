"use client";

import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Community } from "@/db/schema";
import { trpc } from "@/trpc/client";

export default function CommunityDialog({
  communityId,
}: {
  communityId: Community["id"];
}) {
  const editCommunity = trpc.community.editCommunity.useMutation({
    onSuccess: () => {},
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="clip h-6 w-6 rounded-full"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
