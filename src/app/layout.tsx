import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";

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

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${reddit_sans.className} dark antialiased`}>
        {props.children}
        {props.auth}
      </body>
    </html>
  );
}
