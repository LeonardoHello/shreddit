"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavModerated() {
  const trpc = useTRPC();

  const { data: moderatedCommunities } = useSuspenseQuery(
    trpc.community.getModeratedCommunities.queryOptions(),
  );

  return (
    <SidebarCollapsible
      communities={moderatedCommunities}
      title="Communities you moderate or created"
      label="moderated"
      empty={{
        icon: Shield,
        title: "No moderated communities",
        description: "Create a community to see it here",
      }}
    />
  );
}
