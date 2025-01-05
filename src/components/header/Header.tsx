import { auth } from "@clerk/nextjs/server";

import Logo from "@/components/header/Logo";
import Search from "@/components/header/Search";
import UserProfile from "../user/UserProfile";
import SignInButton from "./SignInButton";

export default async function Header() {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-20 col-span-2 flex h-14 justify-between gap-5 border-b bg-card px-4 py-2">
      <Logo />
      <Search />

      {userId ? <UserProfile /> : <SignInButton />}
    </header>
  );
}
