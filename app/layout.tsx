import "./globals.css";

import { Roboto_Flex } from "next/font/google";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Provider } from "@/trpc/client/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import type { Metadata } from "next";

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
          shimmer: true,
        },
        variables: { colorPrimary: "#f43f5e" },
      }}
    >
      <html lang="en">
        <body className={`${nunito_sans.className} bg-zinc-950 text-zinc-300`}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Provider>{children}</Provider>
          <Toaster theme="dark" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
