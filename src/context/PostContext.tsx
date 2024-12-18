import { createContext, useContext, useState } from "react";

import type { RouterOutput } from "@/trpc/routers/_app";

type Post = NonNullable<RouterOutput["getPost"]>;

type PostContextType = {
  post: Post;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostContext = createContext<PostContextType | null>(null);

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
    <PostContext value={{ post, editable, setEditable }}>
      {children}
    </PostContext>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePostContext is used outside it's provider");
  }

  return context;
}
