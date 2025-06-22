import { redirect } from "next/navigation";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import Header from "@/components/header/Header";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import RecentCommunityContextProvider from "@/context/RecentCommunityContext";
import { TRPCReactProvider } from "@/trpc/client";
import { getSession } from "../actions";

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session && !session.user.username) {
    redirect("/choose-username");
  }

  return (
    <>
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(ourFileRouter)}
      />

      <TRPCReactProvider>
        <RecentCommunityContextProvider>
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
              <Header />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </RecentCommunityContextProvider>
      </TRPCReactProvider>

      <Toaster closeButton />
    </>
  );
}
