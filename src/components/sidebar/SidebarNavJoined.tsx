"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavJoined() {
  const trpc = useTRPC();

  const { data: joinedCommunities } = useSuspenseQuery(
    trpc.community.getJoinedCommunities.queryOptions(),
  );

  return (
    <SidebarCollapsible
      communities={joinedCommunities}
      title="Communities you're a member of"
      label="joined"
      empty={{
        icon: Users,
        title: "You're not a member of any community",
        description: "Join a community to see it here",
      }}
    />
  );
}
