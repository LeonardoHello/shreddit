import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommunitySidebar from "./CommunitySidebar";

export default function CommunityHeaderDialog({
  communityName,
}: {
  communityName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-full text-muted-foreground lg:hidden"
        >
          <Info className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader className="sr-only">
          <DialogTitle>Community Information</DialogTitle>
          <DialogDescription>
            This dialog displays details about the community. Please review the
            information provided.
          </DialogDescription>
        </DialogHeader>
        <CommunitySidebar communityName={communityName} isDialog />
      </DialogContent>
    </Dialog>
  );
}
