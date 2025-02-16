"use client";

import { Ellipsis, Pencil, Trash } from "lucide-react";

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
  useCommentDispatchContext,
} from "@/context/CommentContext";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function CommentDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useCommentDispatchContext();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <Ellipsis className="size-4 stroke-[2.5]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropdownMenuLabel>Comment options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              dispatch({ type: ReducerAction.TOGGLE_EDIT });
            }}
          >
            <Pencil className="size-4" />
            <span>Edit comment</span>
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <Trash />
              <span>Delete comment</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {children}
    </AlertDialog>
  );
}
