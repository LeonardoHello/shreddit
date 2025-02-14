import Link from "next/link";

import { Ellipsis, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Community } from "@/db/schema/communities";
import { trpc } from "@/trpc/client";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export default function CommunityHeaderDropdown({
  children,
  communityId,
  communityName,
  isCommunityModerator,
}: {
  children: React.ReactNode;
  communityId: Community["id"];
  communityName: string;
  isCommunityModerator: boolean;
}) {
  const [userToCommunity] =
    trpc.community.getUserToCommunity.useSuspenseQuery(communityName);

  const utils = trpc.useUtils();

  const joinCommunity = trpc.community.toggleJoinCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return { ...userToCommunity, joined: variables.joined };
        }

        return { ...updater, joined: variables.joined };
      });
    },
    onSuccess: (data) => {
      utils.community.getCommunityByName.invalidate(communityName);
      utils.community.getJoinedCommunities.invalidate();

      if (data[0].joined) {
        toast.success(`Joined r/${communityName}`);
      } else {
        toast.success(`Left r/${communityName}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const favoriteCommunity = trpc.community.toggleFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      utils.community.getUserToCommunity.setData(communityName, (updater) => {
        if (!updater) {
          return { ...userToCommunity, favorited: variables.favorited };
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
          return { ...userToCommunity, muted: variables.muted };
        }

        return { ...updater, muted: variables.muted };
      });
    },
    onSuccess: (data) => {
      utils.community.getMutedCommunities.invalidate();

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
    <div className="flex items-center gap-3">
      <Button
        variant={"outline"}
        className="w-9 rounded-full sm:w-auto"
        asChild
      >
        <Link href={`/submit/r/${communityName}`}>
          <Plus className="size-5 stroke-1" viewBox="4 4 16 16" />
          <span className="hidden capitalize sm:block">create post</span>
        </Link>
      </Button>

      <Button
        variant={userToCommunity.joined ? "outline" : "default"}
        className="rounded-full font-bold"
        onClick={() => {
          joinCommunity.mutate({
            communityId,
            joined: !userToCommunity.joined,
          });
        }}
      >
        {userToCommunity.joined ? "Joined" : "Join"}
      </Button>

      <Dialog>
        <AlertDialog>
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
                    favorited: !userToCommunity.favorited,
                  });
                }}
              >
                {userToCommunity.favorited
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  muteCommunity.mutate({
                    communityId,
                    muted: !userToCommunity.muted,
                  });
                }}
              >
                {userToCommunity.muted ? "Unmute" : "Mute"} r/
                {communityName}
              </DropdownMenuItem>

              {isCommunityModerator && (
                <>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Edit community</DropdownMenuItem>
                  </DialogTrigger>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Delete community</DropdownMenuItem>
                  </AlertDialogTrigger>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {children}
        </AlertDialog>
      </Dialog>
    </div>
  );
}
