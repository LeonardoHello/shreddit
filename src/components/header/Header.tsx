import { Suspense } from "react";

import Logo from "@/components/header/Logo";
import Search from "@/components/header/Search";
import { Skeleton } from "../ui/skeleton";
import HeaderUserProfile from "./HeaderUserProfile";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 col-span-2 flex h-14 justify-between gap-5 border-b bg-card px-4 py-2">
      <div className="flex select-none items-center gap-1.5">
        {/* sidebar */}
        {children}

        <Logo />
      </div>
      <Search />

      <Suspense
        fallback={
          <Skeleton className="size-20 self-center rounded-full bg-secondary" />
        }
      >
        <HeaderUserProfile />
      </Suspense>
    </header>
  );
}
