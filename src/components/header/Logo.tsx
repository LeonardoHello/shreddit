import Image from "next/image";
import Link from "next/link";

import { User } from "@clerk/nextjs/server";

import logo from "@public/logo.svg";
import logoText from "@public/logoText.svg";

export default function Logo({ userId }: { userId: User["id"] | null }) {
  const href = userId ? "/home" : "/";

  return (
    <Link href={href} className="flex items-center gap-1.5">
      <Image src={logo} alt="logo" className="size-8 min-w-8" priority />
      <Image
        src={logoText}
        alt="logo"
        className="hidden h-6 w-auto md:block"
        priority
      />
    </Link>
  );
}
