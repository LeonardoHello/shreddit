import { createContext, useContext } from "react";

import type { RouterOutput } from "@/trpc/procedures";

type Comment = NonNullable<RouterOutput["getComment"]>;

const CommentContext = createContext<Comment | null>(null);

export default function CommentContextProvider({
  comment,
  children,
}: {
  comment: Comment;
  children: React.ReactNode;
}) {
  return (
    <CommentContext.Provider value={comment}>
      {children}
    </CommentContext.Provider>
  );
}

export function useCommentContext() {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useCommentContext is used outside it's provider");
  }

  return context;
}
