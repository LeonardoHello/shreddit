import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import Header from "@/components/header/Header";
import { Toaster } from "@/components/ui/sonner";
import RecentCommunityContextProvider from "@/context/RecentCommunityContext";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const reddit_sans = Reddit_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shreddit",
  description:
    "Your Gateway to the Shredditverse - Discover, Share, and Discuss the Best Content on the Swamp. Join Our Thriving Online Community and Explore a World of Diverse Subshreddits, Discussions, and Memes. Connect with Shrek-Minded Ogres on Shreddit Today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          termsPageUrl: "https://clerk.com/terms",
          privacyPageUrl: "https://clerk.com/privacy",
          logoPlacement: "none",
        },
        variables: { colorPrimary: "#f43f5e" },
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${reddit_sans.className} antialiased`}>
          <TRPCReactProvider>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />

            <RecentCommunityContextProvider>
              <SidebarProvider>
                <AppSidebar />

                <SidebarInset>
                  <Header>
                    <SidebarTrigger className="-ml-1 [&_svg]:stroke-[1.5]" />
                  </Header>

                  {children}
                </SidebarInset>
              </SidebarProvider>
            </RecentCommunityContextProvider>
          </TRPCReactProvider>
          <Toaster closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
