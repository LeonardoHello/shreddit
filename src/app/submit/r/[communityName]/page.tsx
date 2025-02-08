import SubmitButton from "@/components/submit/SubmitButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitCommunitySelected from "@/components/submit/SubmitCommunitySelected";
import { Button } from "@/components/ui/button";

export default async function CommunitySubmitPage(props: {
  params: Promise<{ communityName: string }>;
}) {
  const params = await props.params;

  return (
    <>
      <SubmitCommunity>
        <Button variant={"outline"} className="h-10 w-60 border-border sm:w-72">
          <SubmitCommunitySelected communityName={params.communityName} />
        </Button>
      </SubmitCommunity>

      <SubmitButton communityName={params.communityName} />
    </>
  );
}
