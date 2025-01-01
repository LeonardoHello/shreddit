import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import Header from "@/components/header/Header";
import CommunityCreate from "@/components/modal/CommunityCreate";
import PremiumPurchase from "@/components/modal/PremiumPurchase";
import { TRPCProvider } from "@/trpc/client";
import { cn } from "@/utils/cn";

import "./globals.css";

import { Suspense } from "react";

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
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            nunito_sans.className,
            "flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-300",
          )}
        >
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <TRPCProvider>
            {/* Modal components */}
            <Suspense>
              <CommunityCreate />
            </Suspense>
            <Suspense>
              <PremiumPurchase />
            </Suspense>

            <Header />
            <main className="relative grow overflow-y-scroll">{children}</main>
          </TRPCProvider>
          <Toaster theme="dark" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
