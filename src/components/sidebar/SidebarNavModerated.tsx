"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";

import { client } from "@/hono/client";
import type { UserId } from "@/lib/auth";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavModerated({
  currentUserId,
}: {
  currentUserId: NonNullable<UserId>;
}) {
  const { data: moderatedCommunities } = useSuspenseQuery({
    queryKey: ["users", currentUserId, "communities", "moderated"],
    queryFn: async () => {
      const res = await client.users.me.communities.moderated.$get({
        query: { currentUserId },
      });
      return res.json();
    },
  });

  return (
    <SidebarCollapsible
      currentUserId={currentUserId}
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
