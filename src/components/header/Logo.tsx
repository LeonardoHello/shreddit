import Image from "next/image";
import Link from "next/link";

import logo from "@public/logo.svg";
import logoText from "@public/logoText.svg";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5">
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
