"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { client } from "@/hono/client";
import type { UserId } from "@/lib/auth";
import SidebarCollapsible from "./SidebarCollapsible";

export default function SidebarNavJoined({
  currentUserId,
}: {
  currentUserId: NonNullable<UserId>;
}) {
  const { data: joinedCommunities } = useSuspenseQuery({
    queryKey: ["users", currentUserId, "communities", "joined"],
    queryFn: async () => {
      const res = await client.users.me.communities.joined.$get({
        query: { currentUserId },
      });
      return res.json();
    },
  });

  return (
    <SidebarCollapsible
      currentUserId={currentUserId}
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
