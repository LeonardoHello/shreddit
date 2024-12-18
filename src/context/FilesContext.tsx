import { createContext, useContext, useState } from "react";

import type { File } from "../db/schema";

type Files = Omit<File, "id" | "postId">[];

type FilesContextType = {
  files: Files;
  setFiles: React.Dispatch<React.SetStateAction<Files>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilesContext = createContext<FilesContextType | null>(null);

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
    <FilesContext value={{ files, setFiles, isUploading, setIsUploading }}>
      {children}
    </FilesContext>
  );
}

export function useFilesContext() {
  const context = useContext(FilesContext);

  if (!context) {
    throw new Error("useFilesContext is used outside it's provider");
  }

  return context;
}
