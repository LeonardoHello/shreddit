import React from "react";

import { HydrateClient, trpc } from "@/trpc/server";

export default async function CommunitySubmitLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string }>;
}) {
  const params = await props.params;

  void trpc.community.getSelectedCommunity.prefetch(params.communityName);

  return <HydrateClient>{props.children}</HydrateClient>;
}
