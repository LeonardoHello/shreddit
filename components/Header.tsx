import { ClerkLoaded, ClerkLoading, SignInButton, auth } from "@clerk/nextjs";

import HeaderAuthenticated from "@/components/HeaderAuthenticated";
import Logo from "@/components/Logo";
import Search from "@/components/Search";
import cn from "@/lib/utils/cn";

export default function Header() {
  const { userId } = auth();

  return (
    <header
      className={cn(
        "flex h-12 gap-5 border-b border-zinc-700/70 bg-zinc-900 px-5 py-1",
        { "justify-between": userId === null },
      )}
    >
      <Logo />
      <Search />

      {userId ? (
        <HeaderAuthenticated userId={userId} />
      ) : (
        <>
          <ClerkLoading>
            <button className="order-2 rounded-full bg-rose-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-500/80">
              Sign in
            </button>
          </ClerkLoading>
          <ClerkLoaded>
            <SignInButton mode="modal">
              <button className="order-2 rounded-full bg-rose-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-500/80">
                Sign in
              </button>
            </SignInButton>
          </ClerkLoaded>
        </>
      )}
    </header>
  );
}
