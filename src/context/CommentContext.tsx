import { createContext, useContext, useState } from "react";

import type { RouterOutput } from "@/trpc/routers/_app";

type Comment = NonNullable<RouterOutput["getComment"]>;

type CommentContextType = {
  comment: Comment;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  reply: boolean;
  setReply: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentContext = createContext<CommentContextType | null>(null);

export default function CommentContextProvider({
  comment,
  children,
}: {
  comment: Comment;
  children: React.ReactNode;
}) {
  const [editable, setEditable] = useState(false);
  const [reply, setReply] = useState(false);

  return (
    <CommentContext value={{ comment, editable, setEditable, reply, setReply }}>
      {children}
    </CommentContext>
  );
}

export function useCommentContext() {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useCommentContext is used outside it's provider");
  }

  return context;
}
