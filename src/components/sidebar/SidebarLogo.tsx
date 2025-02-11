"use client";

import Image from "next/image";
import Link from "next/link";

import logo from "@public/logo.svg";
import logoText from "@public/logoText.svg";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

export default function SidebarLogo() {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="px-2"
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false);
            }
          }}
        >
          <Link href="/">
            <Image src={logo} alt="logo" priority className="h-full w-auto" />
            <Image
              src={logoText}
              alt="logo text"
              priority
              className="h-5/6 w-auto"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
