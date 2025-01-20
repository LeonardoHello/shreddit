import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Community } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";

export default function CommunityHeaderDropdown({
  communityId,
  communityName,
  isFavorite,
  isMuted,
}: {
  communityId: Community["id"];
  communityName: string;
  isFavorite: boolean;
  isMuted: boolean;
}) {
  const utils = trpc.useUtils();

  const favoriteCommunity = trpc.community.toggleFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return { joined: false, favorited: false, muted: false };
        }

        return { ...updater, favorited: variables.favorited };
      });
    },
    onSuccess: (data) => {
      utils.community.getJoinedCommunities.invalidate();
      utils.community.getModeratedCommunities.invalidate();

      if (data[0].favorited) {
        toast.success(`Added r/${communityName} to favorites.`);
      } else {
        toast.success(`Removed r/${communityName} from favorites.`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const muteCommunity = trpc.community.toggleMuteCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return { joined: false, favorited: false, muted: false };
        }

        return { ...updater, muted: variables.muted };
      });
    },
    onSuccess: (data) => {
      if (data[0].muted) {
        toast.success(`Muted r/${communityName}.`);
      } else {
        toast.success(`Unmuted r/${communityName}.`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Ellipsis className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded bg-card">
        <DropdownMenuItem
          onClick={() => {
            favoriteCommunity.mutate({
              communityId,
              favorited: !isFavorite,
            });
          }}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            muteCommunity.mutate({
              communityId,
              muted: !isMuted,
            });
          }}
        >
          {isMuted ? "Unmute" : "Mute"} r/
          {communityName}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
