"use client";

import { usePostContext } from "@/context/PostContext";
import RTEPostEdit from "../RTE/RTEPostEdit";
import PostContentMedia from "./PostContentMedia";
import PostContentText from "./PostContentText";

export default function PostContent() {
  const state = usePostContext();

  if (state.isEditing) {
    return <RTEPostEdit />;
  }

  if (state.files.length === 0) {
    return <PostContentText />;
  }

  return <PostContentMedia />;
}
