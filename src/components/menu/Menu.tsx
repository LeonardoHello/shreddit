"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

import useDropdown from "@/hooks/useDropdown";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";

export default function Menu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { communityName, username } = useParams();

  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  useEffect(() => {
    setIsOpen(false);
    return () => {
      setIsOpen(false);
    };
  }, [pathname, setIsOpen]);

  return (
    <div
      className="relative flex flex-col bg-inherit lg:my-0.5 lg:w-72"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex basis-full select-none items-center gap-2 rounded border border-transparent px-2.5",
          {
            "rounded-b-none border-zinc-700/70 border-b-transparent": isOpen,
            "hover:border-zinc-700/70": !isOpen,
          },
        )}
      >
        {typeof username === "string" && (
          <CurrentUserFeed username={username} />
        )}

        {typeof communityName === "string" && (
          <CurrentCommunityFeed communityName={communityName} />
        )}

        {pathname === "/submit" && <SubmitFeed />}

        {!username && !communityName && pathname !== "/submit" && (
          <HomeFeed pathname={pathname} />
        )}

        <ChevronDownIcon className="ml-auto h-4 w-4 min-w-[1rem] stroke-2" />
      </button>

      {isOpen && children}
    </div>
  );
}

function CurrentUserFeed({ username }: { username: string }) {
  const userImageUrl = trpc.user.getUserImage.useQuery(username, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {userImageUrl.data ? (
        <Image
          src={userImageUrl.data.imageUrl}
          alt="user icon"
          width={20}
          height={20}
          className="rounded"
        />
      ) : (
        <UserIcon className="h-5 w-5 animate-pulse rounded bg-zinc-300 p-0.5 text-zinc-800 opacity-80" />
      )}
      <h1 className="hidden truncate text-center text-sm font-medium lg:block">
        u/{username}
      </h1>
    </>
  );
}

function CurrentCommunityFeed({ communityName }: { communityName: string }) {
  const communityImageUrl = trpc.community.getCommunityImage.useQuery(
    communityName,
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <CommunityImage imageUrl={communityImageUrl.data?.imageUrl} size={20} />

      <h1 className="hidden truncate text-center text-sm font-medium lg:block">
        u/{communityName}
      </h1>
    </>
  );
}

function HomeFeed({ pathname }: { pathname: string }) {
  if (pathname === "/home") {
    return (
      <>
        <HomeIcon className="h-5 w-5" />
        <h1 className="hidden truncate text-center text-sm font-medium lg:block">
          Home
        </h1>
      </>
    );
  }

  return (
    <>
      <ChartBarIcon className="h-5 w-5 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900" />
      <h1 className="hidden truncate text-center text-sm font-medium lg:block">
        All
      </h1>
    </>
  );
}

function SubmitFeed() {
  return (
    <>
      <PlusIcon className="h-6 w-6 stroke-2 text-zinc-300" />
      <h1 className="hidden truncate text-center text-sm font-medium lg:block">
        Create Post
      </h1>
    </>
  );
}
