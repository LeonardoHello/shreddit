"use client";

import { usePathname } from "next/navigation";

import {
  SignInButton as Button,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";

export default function SignInButton() {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const button = (
    <button className="order-2 whitespace-nowrap rounded-full bg-rose-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-500/80">
      Sign in
    </button>
  );

  return (
    <>
      <ClerkLoading>{button}</ClerkLoading>
      <ClerkLoaded>
        {isAuthPage ? button : <Button mode="modal">{button}</Button>}
      </ClerkLoaded>
    </>
  );
}
