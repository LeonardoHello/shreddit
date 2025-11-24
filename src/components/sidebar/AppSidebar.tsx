import Link from "next/link";

import { Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarLogo from "./SidebarLogo";
import SidebarMenuMain from "./SidebarNavMain";
import SidebarNavRecent from "./SidebarNavRecent";

export function AppSidebar() {
  return (
    <Sidebar className="z-20">
      <SidebarHeader>
        <SidebarLogo />
        <SidebarMenuMain isSignedIn={false} />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent
        style={{
          scrollbarWidth: "thin",
          colorScheme: "dark",
          scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
        }}
        className="gap-0"
      >
        <SidebarNavRecent />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/sign-in"}>
              <SidebarMenuButton className="[&>svg]:size-7">
                <Plus className="stroke-[1.25]" />
                Create Community
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
