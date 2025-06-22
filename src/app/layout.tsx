import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

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
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${reddit_sans.className} antialiased`}>
        {children}
        {auth}
        <Analytics />
      </body>
    </html>
  );
}
