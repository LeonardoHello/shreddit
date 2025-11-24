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
import { client } from "@/hono/client";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function PostDropdown({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: User["id"];
}) {
  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const savePost = useMutation({
    mutationFn: async () => {
      const res = await client.users.me.posts[`:postId{${reg}}`].save.$patch({
        param: { postId: state.id },
        json: { saved: !state.isSaved },
      });

      return res.json();
    },
    onMutate: () => {
      const previousValue = state.isSaved;

      dispatch({
        type: ReducerAction.SET_SAVE,
        save: !state.isSaved,
      });

      return { previousValue };
    },
    onSuccess: (data) => {
      if (data[0].saved) {
        toast.success("Post saved successfully.");
      } else {
        toast.success("Post unsaved successfully.");
      }
    },
    onError: (error, _variables, context) => {
      dispatch({
        type: ReducerAction.SET_SAVE,
        save: context?.previousValue ?? false,
      });

      console.error(error);
      toast.error("Failed to save the post. Please try again later.");
    },
  });

  const hidePost = useMutation({
    mutationFn: async () => {
      const res = await client.users.me.posts[`:postId{${reg}}`].hide.$patch({
        param: { postId: state.id },
        json: { hidden: !state.isHidden },
      });

      return res.json();
    },
    onMutate: () => {
      const previousValue = state.isHidden;

      dispatch({
        type: ReducerAction.SET_HIDE,
        hide: !state.isHidden,
      });

      return { previousValue };
    },
    onSuccess: (data) => {
      if (data[0].hidden) {
        toast.success("Post hidden successfully.");
      } else {
        toast.success("Post unhidden successfully.");
      }
    },
    onError: (error, _variables, context) => {
      dispatch({
        type: ReducerAction.SET_HIDE,
        hide: context?.previousValue ?? false,
      });

      console.error(error);
      toast.error("Failed to hide the post. Please try again later.");
    },
  });

  const setSpoiler = useMutation({
    mutationFn: async () => {
      const res = await client.users.me.posts[`:postId{${reg}}`].spoiler.$patch(
        {
          param: { postId: state.id },
          json: { spoiler: !state.spoiler },
        },
      );

      return res.json();
    },
    onMutate: () => {
      const previousValue = state.spoiler;

      dispatch({
        type: ReducerAction.SET_SPOILER,
        spoiler: !state.spoiler,
      });

      return { previousValue };
    },
    onSuccess: (data) => {
      if (data[0].spoiler) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    },
    onError: (error, _variables, context) => {
      dispatch({
        type: ReducerAction.SET_SPOILER,
        spoiler: context?.previousValue ?? false,
      });

      console.error(error);
      toast.error(
        "Failed to toggle spoiler tag for the post. Please try again later.",
      );
    },
  });

  const setNSFW = useMutation({
    mutationFn: async () => {
      const res = await client.users.me.posts[`:postId{${reg}}`].nsfw.$patch({
        param: { postId: state.id },
        json: { nsfw: !state.nsfw },
      });

      return res.json();
    },
    onMutate: () => {
      const previousValue = state.nsfw;

      dispatch({
        type: ReducerAction.SET_NSFW,
        nsfw: !state.nsfw,
      });

      return { previousValue };
    },
    onSuccess: (data) => {
      if (data[0].nsfw) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    },
    onError: (error, _variables, context) => {
      dispatch({
        type: ReducerAction.SET_NSFW,
        nsfw: context?.previousValue ?? false,
      });

      console.error(error);
      toast.error(
        "Failed to toggle NSFW tag for the post. Please try again later.",
      );
    },
  });

  const isAuthor = currentUserId === state.authorId;
  const isModerator = currentUserId === state.community.moderatorId;

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
              savePost.mutate();
            }}
          >
            {state.isSaved && (
              <>
                <BookmarkCheck />
                <span>Remove from saved</span>
              </>
            )}
            {!state.isSaved && (
              <>
                <Bookmark />
                <span>Save</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              hidePost.mutate();
            }}
          >
            {state.isHidden && (
              <>
                <EyeOff />
                <span>Remove from hidden</span>
              </>
            )}
            {!state.isHidden && (
              <>
                <Eye />
                <span>Hide</span>
              </>
            )}
          </DropdownMenuItem>

          {isAuthor && state.files.length === 0 && (
            <DropdownMenuItem
              onClick={() => {
                dispatch({ type: ReducerAction.TOGGLE_EDIT });
              }}
            >
              <Pencil />
              <span>Edit post</span>
            </DropdownMenuItem>
          )}

          {(isAuthor || isModerator) && (
            <>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <DropdownMenuItem
                onClick={() => {
                  setSpoiler.mutate();
                }}
              >
                {state.spoiler && (
                  <>
                    <AlertTriangle />
                    <span>Remove spoiler tag</span>
                  </>
                )}
                {!state.spoiler && (
                  <>
                    <Triangle />
                    <span>Add spoiler tag</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setNSFW.mutate();
                }}
              >
                {state.nsfw && (
                  <>
                    <ShieldX />
                    <span>Remove NSFW tag</span>
                  </>
                )}
                {!state.nsfw && (
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
