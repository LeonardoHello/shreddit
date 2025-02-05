import { currentUser } from "@clerk/nextjs/server";

import SubmitButton from "@/components/submit/SubmitButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitCommunitySelected from "@/components/submit/SubmitCommunitySelected";
import { Button } from "@/components/ui/button";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function CommunitySubmitPage(props: {
  params: Promise<{ communityName: string }>;
}) {
  const [params, user] = await Promise.all([props.params, currentUser()]);

  if (!user) throw new Error("Cannot read current user information.");

  void trpc.community.getSelectedCommunity.prefetch(params.communityName);

  return (
    <>
      <HydrateClient>
        <SubmitCommunity username={user.username} imageUrl={user.imageUrl}>
          <Button
            variant={"outline"}
            className="h-10 w-64 border-border sm:w-72"
          >
            <SubmitCommunitySelected communityName={params.communityName} />
          </Button>
        </SubmitCommunity>
      </HydrateClient>

      <HydrateClient>
        <SubmitButton communityName={params.communityName} />
      </HydrateClient>
    </>
  );
}
