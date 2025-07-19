import Link from "next/link";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Ellipsis, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Community } from "@/db/schema/communities";
import { useTRPC } from "@/trpc/client";
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
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { data: userToCommunity } = useSuspenseQuery(
    trpc.community.getUserToCommunity.queryOptions(communityName),
  );

  const userToCommunityQueryKey =
    trpc.community.getUserToCommunity.queryKey(communityName);
  const joinedCommunitiesQueryKey =
    trpc.community.getJoinedCommunities.queryKey();

  const joinCommunity = useMutation(
    trpc.community.toggleJoinCommunity.mutationOptions({
      onMutate: (variables) => {
        queryClient.setQueryData(userToCommunityQueryKey, (updater) => {
          if (!updater) {
            return { ...userToCommunity, joined: variables.joined };
          }

          return { ...updater, joined: variables.joined };
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.community.getCommunityByName.queryKey(communityName),
        });
        queryClient.invalidateQueries({
          queryKey: joinedCommunitiesQueryKey,
        });

        if (data[0].joined) {
          toast.success(`Joined r/${communityName}`);
        } else {
          toast.success(`Left r/${communityName}`);
        }
      },
      onError: (error) => {
        queryClient.invalidateQueries({ queryKey: userToCommunityQueryKey });

        console.error(error);
        toast.error("Failed to join the community. Please try again later.");
      },
    }),
  );

  const favoriteCommunity = useMutation(
    trpc.community.toggleFavoriteCommunity.mutationOptions({
      onMutate: (variables) => {
        queryClient.setQueryData(userToCommunityQueryKey, (updater) => {
          if (!updater) {
            return { ...userToCommunity, favorited: variables.favorited };
          }

          return { ...updater, favorited: variables.favorited };
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.community.getModeratedCommunities.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: joinedCommunitiesQueryKey,
        });

        if (data[0].favorited) {
          toast.success(`Added r/${communityName} to favorites.`);
        } else {
          toast.success(`Removed r/${communityName} from favorites.`);
        }
      },
      onError: (error) => {
        queryClient.invalidateQueries({ queryKey: userToCommunityQueryKey });

        console.error(error);
        toast.error(
          "Failed to favorite the community. Please try again later.",
        );
      },
    }),
  );

  const muteCommunity = useMutation(
    trpc.community.toggleMuteCommunity.mutationOptions({
      onMutate: (variables) => {
        queryClient.setQueryData(userToCommunityQueryKey, (updater) => {
          if (!updater) {
            return { ...userToCommunity, muted: variables.muted };
          }

          return { ...updater, muted: variables.muted };
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.community.getMutedCommunities.queryKey(),
        });

        if (data[0].muted) {
          toast.success(`Muted r/${communityName}.`);
        } else {
          toast.success(`Unmuted r/${communityName}.`);
        }
      },
      onError: (error) => {
        queryClient.invalidateQueries({ queryKey: userToCommunityQueryKey });

        console.error(error);
        toast.error("Failed to mute the community. Please try again later.");
      },
    }),
  );

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={"outline"}
        className="w-9 rounded-full sm:w-auto"
        asChild
      >
        <Link href={`/submit/r/${communityName}`}>
          <Plus className="stroke-[1.5]" viewBox="4 4 16 16" />
          <span className="hidden capitalize sm:block">create post</span>
        </Link>
      </Button>

      <Button
        variant={userToCommunity.joined ? "outline" : "default"}
        className="rounded-full"
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Community options</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
