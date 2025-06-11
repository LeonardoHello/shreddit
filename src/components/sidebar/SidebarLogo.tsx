"use client";

import Image from "next/image";
import Link from "next/link";

import shrek from "@public/shrek.svg";
import shrekText from "@public/shrekText.svg";
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
            <Image src={shrek} alt="logo" priority className="size-10" />
            <Image
              src={shrekText}
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
