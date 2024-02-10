import { createContext, useContext, useState } from "react";

import type { File } from "../db/schema";

type Files = Omit<File, "id" | "postId">[];

const FilesContext = createContext<{
  files: Files;
  setFiles: React.Dispatch<React.SetStateAction<Files>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export default function FilesContextProvider({
  initialFiles,
  children,
}: {
  initialFiles: Files;
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <FilesContext.Provider
      value={{ files, setFiles, isUploading, setIsUploading }}
    >
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
