"use client";

import { useParams } from "next/navigation";

import { usePostContext } from "@/context/PostContext";
import { cn } from "@/utils/cn";
import RTEPostEdit from "../RTE/RTEPostEdit";
import PostContentMedia from "./PostContentMedia";
import PostContentText from "./PostContentText";

export default function PostContent() {
  const { postId } = useParams();

  const state = usePostContext();

  return (
    <>
      <h2
        className={cn("text-lg font-medium", {
          "text-2xl font-semibold": postId,
        })}
      >
        {state.title}
      </h2>

      {state.isEditing ? (
        <RTEPostEdit />
      ) : state.files.length === 0 ? (
        <PostContentText />
      ) : (
        <PostContentMedia />
      )}
    </>
  );
}
