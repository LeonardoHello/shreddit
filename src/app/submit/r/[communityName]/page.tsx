import SubmitButton from "@/components/submit/SubmitButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitCommunitySelected from "@/components/submit/SubmitCommunitySelected";
import { Button } from "@/components/ui/button";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function CommunitySubmitPage(props: {
  params: Promise<{ communityName: string }>;
}) {
  const params = await props.params;

  void trpc.community.getSelectedCommunity.prefetch(params.communityName);
  void trpc.community.getMyCommunities.prefetch();

  return (
    <HydrateClient>
      <SubmitCommunity>
        <Button variant={"outline"} className="h-10 w-60 border-border sm:w-72">
          <SubmitCommunitySelected communityName={params.communityName} />
        </Button>
      </SubmitCommunity>

      <SubmitButton communityName={params.communityName} />
    </HydrateClient>
  );
}
