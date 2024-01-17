import { createContext, useContext } from "react";

import type { RouterOutput } from "@/trpc/procedures";

type Post = NonNullable<RouterOutput["getPost"]>;

const PostContext = createContext<Post | null>(null);

export default function PostContextProvider({
  post,
  children,
}: {
  post: Post;
  children: React.ReactNode;
}) {
  return <PostContext.Provider value={post}>{children}</PostContext.Provider>;
}

export function usePostContext() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePostContext is used outside it's provider");
  }

  return context;
}
