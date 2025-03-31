import React from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

export default async function CommunitySubmitLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string }>;
}) {
  const params = await props.params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.community.getSelectedCommunity.queryOptions(params.communityName),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
