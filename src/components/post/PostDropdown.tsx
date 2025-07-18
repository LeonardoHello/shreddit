"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Ellipsis,
  Eye,
  EyeOff,
  Pencil,
  Shield,
  ShieldX,
  Trash,
  Triangle,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { User } from "@/db/schema/users";
import { useTRPC } from "@/trpc/client";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function PostDropdown({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: User["id"];
}) {
  const post = usePostContext();
  const dispatch = usePostDispatchContext();

  const trpc = useTRPC();

  const savePost = useMutation(
    trpc.post.savePost.mutationOptions({
      onMutate: (variables) => {
        dispatch({
          type: ReducerAction.SET_SAVE,
          save: variables.saved,
        });
      },
      onSuccess: (data) => {
        if (data[0].saved) {
          toast.success("Post saved successfully.");
        } else {
          toast.success("Post unsaved successfully.");
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          "Failed to save the post. Please try refreshing the page or try again later.",
        );
      },
    }),
  );

  const hidePost = useMutation(
    trpc.post.hidePost.mutationOptions({
      onMutate: (variables) => {
        dispatch({
          type: ReducerAction.SET_HIDE,
          hide: variables.hidden,
        });
      },
      onSuccess: (data) => {
        if (data[0].hidden) {
          toast.success("Post hidden successfully.");
        } else {
          toast.success("Post unhidden successfully.");
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          "Failed to hide the post. Please try refreshing the page or try again later.",
        );
      },
    }),
  );

  const setSpoiler = useMutation(
    trpc.post.setPostSpoiler.mutationOptions({
      onMutate: (variables) => {
        dispatch({
          type: ReducerAction.SET_SPOILER,
          spoiler: variables.spoiler,
        });
      },
      onSuccess: (data) => {
        if (data[0].spoiler) {
          toast.success("Post has been marked as spoiler");
        } else {
          toast.success("Post has been un-marked as a spoiler");
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          "Failed to toggle spoiler tag for the post. Please try refreshing the page or try again later.",
        );
      },
    }),
  );

  const setNSFW = useMutation(
    trpc.post.setPostNSFW.mutationOptions({
      onMutate: (variables) => {
        dispatch({
          type: ReducerAction.SET_NSFW,
          nsfw: variables.nsfw,
        });
      },
      onSuccess: (data) => {
        if (data[0].nsfw) {
          toast.success("Post has been marked as spoiler");
        } else {
          toast.success("Post has been un-marked as a spoiler");
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          "Failed to toggle NSFW tag for the post. Please try refreshing the page or try again later.",
        );
      },
    }),
  );

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 rounded-full">
            <Ellipsis className="size-4 stroke-[2.5]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropdownMenuLabel>Post options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              savePost.mutate({ saved: !post.isSaved, postId: post.id });
            }}
          >
            {post.isSaved && (
              <>
                <BookmarkCheck />
                <span>Remove from saved</span>
              </>
            )}
            {!post.isSaved && (
              <>
                <Bookmark />
                <span>Save</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              hidePost.mutate({ hidden: !post.isHidden, postId: post.id });
            }}
          >
            {post.isHidden && (
              <>
                <EyeOff />
                <span>Remove from hidden</span>
              </>
            )}
            {!post.isHidden && (
              <>
                <Eye />
                <span>Hide</span>
              </>
            )}
          </DropdownMenuItem>
          {currentUserId === post.authorId && (
            <>
              {post.files.length === 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    dispatch({ type: ReducerAction.TOGGLE_EDIT });
                  }}
                >
                  <Pencil />
                  <span>Edit post</span>
                </DropdownMenuItem>
              )}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <DropdownMenuItem
                onClick={() => {
                  setSpoiler.mutate({ id: post.id, spoiler: !post.spoiler });
                }}
              >
                {post.spoiler && (
                  <>
                    <AlertTriangle />
                    <span>Remove spoiler tag</span>
                  </>
                )}
                {!post.spoiler && (
                  <>
                    <Triangle />
                    <span>Add spoiler tag</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setNSFW.mutate({ id: post.id, nsfw: !post.nsfw });
                }}
              >
                {post.nsfw && (
                  <>
                    <ShieldX />
                    <span>Remove NSFW tag</span>
                  </>
                )}
                {!post.nsfw && (
                  <>
                    <Shield />
                    <span>Add NSFW tag</span>
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {children}
    </AlertDialog>
  );
}
