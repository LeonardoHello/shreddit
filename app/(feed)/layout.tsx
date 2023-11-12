import Link from "next/link";

import Logo from "@/components/Logo";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-12 gap-5 border-b border-zinc-700/70 bg-zinc-900 px-5 py-1">
        <Logo />

        <Link
          href="/sign-in"
          className="order-2 self-center rounded-full bg-rose-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-500/80"
        >
          Sign in
        </Link>
      </header>
      {children}
    </div>
  );
}
