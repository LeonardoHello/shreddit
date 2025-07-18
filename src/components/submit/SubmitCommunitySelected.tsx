"use client";

import Image from "next/image";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";

export default function SubmitCommunitySelected({
  communityName,
}: {
  communityName: string;
}) {
  const trpc = useTRPC();

  const { data: selectedCommunity } = useSuspenseQuery(
    trpc.community.getSelectedCommunity.queryOptions(communityName),
  );

  if (!selectedCommunity)
    throw new Error("There was a problem with a community selection.");

  return (
    <>
      <Image
        src={selectedCommunity.icon ?? defaultCommunityIcon}
        alt={`${selectedCommunity.name} community icon`}
        width={24}
        height={24}
        className="rounded-full object-contain select-none"
      />

      <span className="truncate">r/{selectedCommunity.name}</span>

      <ChevronDown className="text-muted-foreground ml-auto size-5" />
    </>
  );
}
