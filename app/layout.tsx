import "./globals.css";

import { Roboto_Flex } from "next/font/google";
import { Toaster } from "sonner";

import { Provider } from "@/trpc/client/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import type { Metadata } from "next";

const nunito_sans = Roboto_Flex({
  subsets: ["latin"],
});

export const runtime = "edge";

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
    <html lang="en">
      <body className={`${nunito_sans.className} bg-zinc-950 text-zinc-300`}>
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
          <Provider>{children}</Provider>
        </ClerkProvider>
        <Toaster theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
