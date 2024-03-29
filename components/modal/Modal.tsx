"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.replace(pathname, { scroll: false });
    };

    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [router, pathname]);

  return (
    <div
      className="fixed left-0 top-0 z-30 grid h-screen w-screen place-items-center overflow-y-scroll bg-zinc-900/70 p-2"
      onClick={() => router.replace(pathname, { scroll: false })}
    >
      <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
