import { usePostContext } from "@/lib/context/PostContextProvider";

import PostEditRTE from "../RTE/PostEditRTE";
import PostContentMedia from "./PostContentMedia";
import PostContentText from "./PostContentText";

export default function PostContent() {
  const { post, editable } = usePostContext();

  if (editable) {
    return <PostEditRTE />;
  }

  return post.text ? <PostContentText /> : <PostContentMedia />;
}
