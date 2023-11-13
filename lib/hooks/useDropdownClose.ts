"use client";

import { useEffect, useRef, useState } from "react";

export default function useDropdownClose() {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const clickListener = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  return { dropdownRef, isOpen, setIsOpen };
}
