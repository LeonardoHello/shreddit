"use client";

import { useParams } from "next/navigation";

import { usePostContext } from "@/context/PostContext";
import { cn } from "@/utils/cn";
import RTEPostEdit from "../RTE/RTEPostEdit";
import PostBodyImage from "./PostBodyImage";
import PostBodyText from "./PostBodyText";

export default function PostBody() {
  const { postId } = useParams();

  const state = usePostContext();

  return (
    <div className="flex flex-col gap-2">
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
        <PostBodyText />
      ) : (
        <PostBodyImage />
      )}
    </div>
  );
}
