"use client";

import { useEffect } from "react";

import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

import useDropdown from "@/lib/hooks/useDropdown";
import cn from "@/lib/utils/cn";
import communityImage from "@/public/community-logo.svg";
import { trpc } from "@/trpc/react";

export default function Menu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { communityName, userName } = useParams();
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
        {typeof userName === "string" && (
          <CurrentUserFeed userName={userName} />
        )}

        {typeof communityName === "string" && (
          <CurrentCommunityFeed communityName={communityName} />
        )}

        {!userName && !communityName && <HomeFeed pathname={pathname} />}

        <ChevronDownIcon className="ml-auto h-4 w-4 min-w-[1rem] stroke-2" />
      </button>

      {isOpen && children}
    </div>
  );
}

function CurrentUserFeed({ userName }: { userName: string }) {
  const userImageUrl = trpc.getUserImage.useQuery(userName, {
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
          className="rounded-full"
        />
      ) : (
        <UserIcon className="h-5 w-5 animate-pulse rounded-full bg-zinc-300 p-0.5 text-zinc-800 opacity-80" />
      )}
      <h1 className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm font-medium lg:block">
        u/{userName}
      </h1>
    </>
  );
}

function CurrentCommunityFeed({ communityName }: { communityName: string }) {
  const communityImageUrl = trpc.getCommunityImage.useQuery(communityName, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {communityImageUrl.data ? (
        <Image
          src={communityImageUrl.data.imageUrl ?? communityImage}
          alt="community icon"
          width={20}
          height={20}
          className={cn("rounded-full", {
            "border border-zinc-300 bg-zinc-300":
              communityImageUrl.data?.imageUrl === null,
          })}
        />
      ) : (
        <Image
          src={communityImage}
          alt="community icon"
          width={20}
          height={20}
          className="rounded-full border border-zinc-300 bg-zinc-300"
        />
      )}

      <h1 className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm font-medium lg:block">
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
        <h1 className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm font-medium lg:block">
          Home
        </h1>
      </>
    );
  }

  return (
    <>
      <ChartBarIcon className="h-5 w-5 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900" />
      <h1 className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm font-medium lg:block">
        All
      </h1>
    </>
  );
}
