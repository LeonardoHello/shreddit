import FilesContextProvider from "@/lib/context/FilesContextProvider";
import { usePostContext } from "@/lib/context/PostContextProvider";

import RTEPostEdit from "../RTE/RTEPostEdit";
import PostContentMedia from "./PostContentMedia";
import PostContentText from "./PostContentText";

export default function PostContent() {
  const { post, editable } = usePostContext();

  if (editable) {
    const initialFiles = post.files.map(({ id, postId, ...rest }) => rest);
    return (
      <FilesContextProvider initialFiles={initialFiles}>
        <RTEPostEdit />
      </FilesContextProvider>
    );
  }

  return post.text ? <PostContentText /> : <PostContentMedia />;
}
