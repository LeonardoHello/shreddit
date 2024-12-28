"use client";

import { usePostContext } from "@/context/PostContext";
import PostContentMedia from "./PostContentMedia";
import PostContentText from "./PostContentText";
import PostEditRTE from "./PostEditRTE";

export default function PostContent() {
  const state = usePostContext();

  if (state.edit) {
    return <PostEditRTE />;
  }

  if (state.files.length === 0) {
    return <PostContentText />;
  }

  return <PostContentMedia />;
}
