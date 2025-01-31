"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@clerk/nextjs";

import { trpc } from "@/trpc/client";
import { PostSort } from "@/types";
import logo from "@public/logo.svg";
import logoText from "@public/logoText.svg";

export default function Logo() {
  const auth = useAuth();
  const utils = trpc.useUtils();

  const prefetchHome = () => {
    const homePosts = utils.postFeed.getHomePosts;

    if (!homePosts.getInfiniteData({ sort: PostSort.BEST })) {
      homePosts.prefetchInfinite({ sort: PostSort.BEST });
    }
  };

  const prefetchAll = () => {
    const allPosts = utils.postFeed.getAllPosts;

    if (!allPosts.getInfiniteData({ sort: PostSort.BEST })) {
      allPosts.prefetchInfinite({ sort: PostSort.BEST });
    }
  };

  const href = auth.isSignedIn ? "/home" : "/";

  const toPrefetch = auth.isSignedIn ? prefetchHome : prefetchAll;

  return (
    <Link
      href={href}
      className="flex items-center gap-1.5"
      onTouchStart={toPrefetch}
      onMouseEnter={toPrefetch}
    >
      <Image src={logo} alt="logo" className="size-8" />
      <Image src={logoText} alt="logo" className="hidden h-6 w-auto md:block" />
    </Link>
  );
}
