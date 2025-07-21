"use client";

import { usePathname } from "next/navigation";

import { Earth, Home } from "lucide-react";

import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

export default function SidebarNavMain({
  isSignedIn,
}: {
  isSignedIn: boolean;
}) {
  const pathname = usePathname();

  const { isMobile, setOpenMobile } = useSidebar();

  const isAll = pathname.startsWith("/all") || pathname === "/";
  const isHome = pathname.startsWith("/home");

  const items = [
    {
      label: "All",
      href: "/all",
      isActive: isAll,
      icon: Earth,
      authRequired: false,
    },
    {
      label: "Home",
      href: "/home",
      isActive: isHome,
      icon: Home,
      authRequired: true,
    },
  ];

  return (
    <SidebarMenu>
      {items
        // Filter items based on authentication status
        .filter((item) => isSignedIn || !item.authRequired)
        .map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              onClick={() => {
                if (isMobile) {
                  setOpenMobile(false);
                }
              }}
              className="[&>svg]:size-5"
            >
              <HoverPrefetchLink href={item.href}>
                <item.icon className="stroke-[1.5]" />
                <span>{item.label}</span>
              </HoverPrefetchLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}
