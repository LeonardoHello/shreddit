import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import Header from "@/components/header/Header";
import { TRPCProvider } from "@/trpc/client";

import "./globals.css";

import Sidebar from "@/components/sidebar/Sidebar";
import RecentCommunityContextProvider from "@/context/RecentCommunityContext";

const nunito_sans = Roboto_Flex({
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={nunito_sans.className}>
        <ClerkProvider
          dynamic
          appearance={{
            baseTheme: dark,
            layout: {
              termsPageUrl: "https://clerk.com/terms",
              privacyPageUrl: "https://clerk.com/privacy",
              logoPlacement: "none",
              socialButtonsVariant: "iconButton",
            },
            variables: { colorPrimary: "#f43f5e" },
          }}
        >
          <TRPCProvider>
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
              <Header />
              <div className="flex">
                <div
                  style={{ scrollbarWidth: "thin", colorScheme: "dark" }}
                  className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 gap-3 overflow-y-auto border-r bg-card p-4 xl:block"
                >
                  <Sidebar />
                </div>
                <main className="grow overflow-hidden">{children}</main>
              </div>
            </RecentCommunityContextProvider>
          </TRPCProvider>
          <Toaster theme="dark" richColors closeButton />
        </ClerkProvider>
      </body>
    </html>
  );
}
