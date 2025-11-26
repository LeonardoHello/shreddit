import Link from "next/link";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
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
import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";
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
  const queryClient = getQueryClient();

  const userToCommunityQueryKey = ["users", "me", "communities", communityName];
  const joinedCommunitiesQueryKey = ["users", "me", "communities", "joined"];

  const { data: userToCommunity } = useSuspenseQuery({
    queryKey: userToCommunityQueryKey,
    queryFn: async () => {
      const res = await client.users.me.communities[":communityName"].$get({
        param: { communityName },
      });

      const data = await res.json();

      return data ?? { favorited: false, joined: false, muted: false };
    },
  });

  const joinCommunity = useMutation({
    mutationFn: async (joined: NonNullable<typeof userToCommunity.joined>) => {
      const res = await client.users.me.communities[
        `:communityId{${reg}}`
      ].join.$patch({
        param: { communityId },
        json: { joined },
      });

      return res.json();
    },
    onMutate: (variables) => {
      queryClient.setQueryData<typeof userToCommunity>(
        userToCommunityQueryKey,
        (updater) => {
          if (!updater) {
            return { ...userToCommunity, variables };
          }

          return { ...updater, variables };
        },
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["communities", communityName],
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
      queryClient.invalidateQueries({
        queryKey: userToCommunityQueryKey,
      });

      console.error(error);
      toast.error("Failed to join the community. Please try again later.");
    },
  });

  const favoriteCommunity = useMutation({
    mutationFn: async (
      favorited: NonNullable<typeof userToCommunity.favorited>,
    ) => {
      const res = await client.users.me.communities[
        `:communityId{${reg}}`
      ].favorite.$patch({
        param: { communityId },
        json: { favorited },
      });

      return res.json();
    },
    onMutate: (variables) => {
      queryClient.setQueryData(userToCommunityQueryKey, (updater) => {
        if (!updater) {
          return { ...userToCommunity, variables };
        }

        return { ...updater, variables };
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "moderated"],
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
      toast.error("Failed to favorite the community. Please try again later.");
    },
  });

  const muteCommunity = useMutation({
    mutationFn: async (muted: NonNullable<typeof userToCommunity.muted>) => {
      const res = await client.users.me.communities[
        `:communityId{${reg}}`
      ].mute.$patch({
        param: { communityId },
        json: { muted },
      });

      return res.json();
    },
    onMutate: (variables) => {
      queryClient.setQueryData(userToCommunityQueryKey, (updater) => {
        if (!updater) {
          return { ...userToCommunity, variables };
        }

        return { ...updater, variables };
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "muted"],
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
  });

  return (
    <div className="flex items-center gap-3">
      <Button variant={"outline"} asChild>
        <Link href={`/submit/r/${communityName}`}>
          <Plus className="stroke-[1.5]" viewBox="4 4 16 16" />
          <span className="capitalize">create post</span>
        </Link>
      </Button>

      <Button
        variant={userToCommunity.joined ? "outline" : "default"}
        onClick={() => {
          joinCommunity.mutate(!userToCommunity.joined);
        }}
      >
        {userToCommunity.joined ? "Joined" : "Join"}
      </Button>

      <Dialog>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size="icon">
                <Ellipsis className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Community options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  favoriteCommunity.mutate(!userToCommunity.favorited);
                }}
              >
                {userToCommunity.favorited
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  muteCommunity.mutate(!userToCommunity.muted);
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
