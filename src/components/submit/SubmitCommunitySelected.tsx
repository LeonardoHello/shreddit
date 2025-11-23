"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { client } from "@/hono/client";
import CommunityIcon from "../community/CommunityIcon";

export default function SubmitCommunitySelected({
  communityName,
}: {
  communityName: string;
}) {
  const { data: selectedCommunity } = useSuspenseQuery({
    queryKey: ["communities", communityName, "submit"],
    queryFn: async () => {
      const res = await client.communities[":communityName"].submit.$get({
        param: { communityName },
      });
      return res.json();
    },
  });

  if (!selectedCommunity)
    throw new Error("There was a problem with a community selection.");

  return (
    <>
      <CommunityIcon
        icon={selectedCommunity.icon}
        iconPlaceholder={selectedCommunity.iconPlaceholder}
        communtiyName={selectedCommunity.name}
        size={24}
        className="aspect-square rounded-full object-cover select-none"
      />

      <span className="truncate">r/{selectedCommunity.name}</span>

      <ChevronDown className="text-muted-foreground ml-auto size-5" />
    </>
  );
}
