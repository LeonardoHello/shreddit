"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@clerk/nextjs";

import logo from "@public/logo.svg";
import logoText from "@public/logoText.svg";

export default function Logo() {
  // TODO: remove this
  const auth = useAuth();

  const href = auth.isSignedIn ? "/home" : "/";

  return (
    <Link href={href} className="flex items-center gap-1.5">
      <Image src={logo} alt="logo" className="size-8" />
      <Image src={logoText} alt="logo" className="hidden h-6 w-auto md:block" />
    </Link>
  );
}
