import { getSession } from "@/app/actions";
import SubmitButton from "@/components/submit/SubmitButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitCommunitySelected from "@/components/submit/SubmitCommunitySelected";
import { Button } from "@/components/ui/button";

export default async function CommunitySubmitPage(
  props: PageProps<"/submit/r/[communityName]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  if (!session) {
    throw new Error("Unauthenticated");
  }

  return (
    <>
      <SubmitCommunity currentUserId={session.session.userId}>
        <Button variant={"outline"} className="border-border h-10 w-60 sm:w-72">
          <SubmitCommunitySelected communityName={params.communityName} />
        </Button>
      </SubmitCommunity>

      <SubmitButton communityName={params.communityName} />
    </>
  );
}
