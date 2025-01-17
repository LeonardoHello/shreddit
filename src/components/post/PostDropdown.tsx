"use client";

import { useParams, useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";

export default function PostDropdown({
  currentUserId,
}: {
  currentUserId: User["id"];
}) {
  const { postId } = useParams();
  const router = useRouter();

  const post = usePostContext();
  const dispatch = usePostDispatchContext();

  const savePost = trpc.post.savePost.useMutation({
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
      toast.error(error.message);
    },
  });

  const hidePost = trpc.post.hidePost.useMutation({
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
      toast.error(error.message);
    },
  });

  const deletePost = trpc.post.deletePost.useMutation({
    onMutate: () => {
      dispatch({ type: ReducerAction.DELETE });
    },
    onSuccess: () => {
      if (postId) {
        router.replace("/");
      }

      toast.success("Post deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const setSpoiler = trpc.post.setPostSpoiler.useMutation({
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
      toast.error(error.message);
    },
  });

  const setNSFW = trpc.post.setPostNSFW.useMutation({
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
      toast.error(error.message);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7 rounded-full">
          <Ellipsis className="size-4 stroke-[2.5]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded bg-card"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
            <DropdownMenuItem
              onClick={() => {
                if (!deletePost.isPending) {
                  deletePost.mutate(post.id);
                }
              }}
            >
              <Trash />
              <span>Delete</span>
            </DropdownMenuItem>
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
  );
}
