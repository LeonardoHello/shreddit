import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import type { RouterOutput } from "@/trpc/procedures";

type Post = NonNullable<RouterOutput["getPost"]>;

const PostContext = createContext<{
  post: Post;
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export default function PostContextProvider({
  post,
  initialEdit,
  children,
}: {
  post: Post;
  initialEdit: boolean;
  children: React.ReactNode;
}) {
  const [editable, setEditable] = useState(initialEdit);

  return (
    <PostContext.Provider value={{ post, editable, setEditable }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePostContext is used outside it's provider");
  }

  return context;
}
