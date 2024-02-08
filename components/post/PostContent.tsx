import { usePostContext } from "@/lib/context/PostContextProvider";

import RTEPostEdit from "../RTE/RTEPostEdit";
import PostContentMedia from "./PostContentMedia";
import PostContentText from "./PostContentText";

export default function PostContent() {
  const { post, editable } = usePostContext();

  if (editable) {
    return <RTEPostEdit />;
  }

  return post.text ? <PostContentText /> : <PostContentMedia />;
}
