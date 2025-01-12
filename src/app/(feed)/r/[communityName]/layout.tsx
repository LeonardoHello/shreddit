import { trpc } from "@/trpc/server";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function CommunityLayout(props: {
  children: React.ReactNode;
  params: Promise<{ communityName: string }>;
}) {
  const params = await props.params;

  void trpc.community.getCommunityByName.prefetch(params.communityName);

  return props.children;
}
