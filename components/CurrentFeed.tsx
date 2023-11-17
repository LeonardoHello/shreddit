"use client";

import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

import useDropdownClose from "@/lib/hooks/useDropdownClose";
import cn from "@/lib/utils/cn";
import communityImage from "@/public/community-logo.svg";
import { trpc } from "@/trpc/client";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

export default function CurrentFeed({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { communityName, userName } = useParams();
  const { dropdownRef, isOpen, setIsOpen } = useDropdownClose();

  useEffect(() => {
    setIsOpen(false);
    return () => {
      setIsOpen(false);
    };
  }, [pathname, setIsOpen]);

  const userImageUrl = trpc.userImage.useQuery(userName as string | undefined, {
    refetchOnWindowFocus: false,
  });
  const communityImageUrl = trpc.communityImage.useQuery(
    communityName as string | undefined,
    { refetchOnWindowFocus: false },
  );

  let feedImg;
  let feedTitle;

  if (typeof userName === "string") {
    if (userImageUrl.data) {
      feedImg = (
        <Image
          src={userImageUrl.data.imageUrl}
          alt="user icon"
          width={20}
          height={20}
          className="rounded-full"
        />
      );
    } else {
      feedImg = (
        <UserIcon className="h-5 w-5 animate-pulse rounded-full bg-zinc-300 p-0.5 text-zinc-800 opacity-80" />
      );
    }
    feedTitle = "u/" + userName;
  } else if (typeof communityName === "string") {
    if (communityImageUrl.data) {
      feedImg = (
        <Image
          src={communityImageUrl.data.imageUrl ?? communityImage}
          alt="community icon"
          width={20}
          height={20}
          className={cn("rounded-full", {
            "border border-zinc-300 bg-zinc-300":
              communityImageUrl.data.imageUrl === null,
          })}
        />
      );
    } else {
      feedImg = (
        <Image
          src={communityImage}
          alt="community icon"
          width={20}
          height={20}
          className="rounded-full border border-zinc-300 bg-zinc-300"
        />
      );
    }

    feedTitle = "r/" + communityName;
  } else if (pathname === "/all") {
    feedImg = (
      <ChartBarIcon className="h-5 w-5 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900" />
    );
    feedTitle = "All";
  } else {
    feedImg = <HomeIcon className="h-5 w-5" />;
    feedTitle = "Home";
  }

  return (
    <div
      className="relative flex flex-col bg-inherit md:my-0.5 md:w-72"
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
        {feedImg}

        <h1
          className={cn(
            "hidden overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm font-medium md:block",
            { hidden: !isOpen },
          )}
        >
          {feedTitle}
        </h1>
        <ChevronDownIcon className="ml-auto h-4 w-4 stroke-2" />
      </button>

      {isOpen ? children : null}
    </div>
  );
}
