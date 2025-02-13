"use client";

import { useEffect, useState } from "react";

export default function useDropdown(
  ref: React.RefObject<HTMLDivElement | null>,
) {
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
  }, [isOpen, ref]);

  return { ref, isOpen, setIsOpen };
}
