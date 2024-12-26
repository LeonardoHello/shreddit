"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type FilesContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<FilesContextType | null>(null);

export default function DropdownContextProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const clickListener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", clickListener);
    } else {
      document.removeEventListener("mousedown", clickListener);
    }

    return () => {
      document.removeEventListener("mousedown", clickListener);
    };
  }, [isOpen]);

  return (
    <DropdownContext value={{ isOpen, setIsOpen }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </DropdownContext>
  );
}

export function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("useDropdownContext is used outside it's provider");
  }

  return context;
}
