import Image from "next/image";
import Link from "next/link";

import logoText from "@/public/logo-text.svg";
import logo from "@/public/logo.svg";

export default function Logo() {
  return (
    <Link href="/" as="/all" className="flex select-none items-center gap-1.5">
      <Image src={logo} alt="logo" width={32} priority />
      <Image
        src={logoText}
        alt="logo text"
        height={24}
        priority
        className="hidden md:block"
      />
    </Link>
  );
}
