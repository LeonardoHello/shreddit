import { createContext, useContext, useState } from "react";

import type { File } from "../db/schema";

type Files = Omit<File, "id" | "postId">[];

const FilesContext = createContext<{
  files: Files;
  setFiles: React.Dispatch<React.SetStateAction<Files>>;
} | null>(null);

export default function FilesContextProvider({
  initialFiles,
  children,
}: {
  initialFiles: Files;
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState(initialFiles);

  return (
    <FilesContext.Provider value={{ files, setFiles }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFilesContext() {
  const context = useContext(FilesContext);

  if (!context) {
    throw new Error("useFilesContext is used outside it's provider");
  }

  return context;
}
