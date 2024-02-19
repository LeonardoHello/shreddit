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
import cn from "@/lib/utils/cn";
import { TRPCReactProvider } from "@/trpc/react";

import "./globals.css";

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
          className={cn(nunito_sans.className, "bg-zinc-950 text-zinc-300")}
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
          <TRPCReactProvider>
            {/* Modal components */}
            <CommunityCreate />
            <PremiumPurchase />

            <Header />
            <div className="flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden">
              {children}
            </div>
          </TRPCReactProvider>
          <Toaster theme="dark" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
