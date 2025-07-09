"use client";

import { usePathname } from "next/navigation";

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
      icon: isAll ? ActiveAllIcon : InactiveAllIcon,
      authRequired: false,
    },
    {
      label: "Home",
      href: "/home",
      isActive: isHome,
      icon: isHome ? ActiveHomeIcon : InactiveHomeIcon,
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
                <item.icon />
                <span>{item.label}</span>
              </HoverPrefetchLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}

function ActiveHomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      icon-name="home-fill"
      viewBox="0 0 20 20"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m19.724 6.765-9.08-6.11A1.115 1.115 0 0 0 9.368.647L.276 6.765a.623.623 0 0 0 .35 1.141h.444v10.001c.001.278.113.544.31.74.196.195.462.304.739.303h5.16a.704.704 0 0 0 .706-.707v-4.507c0-.76 1.138-1.475 2.02-1.475.882 0 2.02.715 2.02 1.475v4.507a.71.71 0 0 0 .707.707h5.16c.274-.001.538-.112.732-.307.195-.195.305-.46.306-.736v-10h.445a.618.618 0 0 0 .598-.44.625.625 0 0 0-.25-.702Z"></path>
    </svg>
  );
}

function InactiveHomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      icon-name="home-outline"
      viewBox="0 0 20 20"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m17.71 8.549 1.244.832v8.523a1.05 1.05 0 0 1-1.052 1.046H12.73a.707.707 0 0 1-.708-.707v-4.507c0-.76-1.142-1.474-2.026-1.474-.884 0-2.026.714-2.026 1.474v4.507a.71.71 0 0 1-.703.707H2.098a1.046 1.046 0 0 1-1.052-1.043V9.381l1.244-.835v9.158h4.44v-3.968c0-1.533 1.758-2.72 3.27-2.72s3.27 1.187 3.27 2.72v3.968h4.44V8.549Zm2.04-1.784L10.646.655a1.12 1.12 0 0 0-1.28-.008L.25 6.765l.696 1.036L10 1.721l9.054 6.08.696-1.036Z"></path>
    </svg>
  );
}

function InactiveAllIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      icon-name="all-fill"
      viewBox="0 0 20 20"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 0a10 10 0 1 0 10 10A10.01 10.01 0 0 0 10 0Zm5 17.171V6h-1.25v11.894a8.66 8.66 0 0 1-2.75.794V10H9.75v8.737A8.684 8.684 0 0 1 6.47 18H7v-4H5.75v3.642a8.753 8.753 0 1 1 9.25-.471Z"></path>
    </svg>
  );
}

function ActiveAllIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      icon-name="all-fill"
      viewBox="0 0 20 20"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 0a10 10 0 1 0 10 10A10.01 10.01 0 0 0 10 0ZM7 18.209a8.664 8.664 0 0 1-1.5-.719V14H7v4.209Zm4 .479c-.332.04-.666.06-1 .062-.169 0-.334-.016-.5-.025V10H11v8.688Zm4-1.517c-.471.33-.973.612-1.5.843V6H15v11.171Z"></path>
    </svg>
  );
}
