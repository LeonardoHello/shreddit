import FilesContextProvider from "@/context/FilesContext";
import { usePostContext } from "@/context/PostContext";
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
