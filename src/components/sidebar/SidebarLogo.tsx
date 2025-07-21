"use client";

import Image from "next/image";

import shrek from "@public/shrek.svg";
import shrekText from "@public/shrekText.svg";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
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
          <HoverPrefetchLink href="/">
            <Image src={shrek} alt="logo" priority className="size-10" />
            <Image
              src={shrekText}
              alt="logo text"
              priority
              className="h-full w-auto"
            />
          </HoverPrefetchLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
