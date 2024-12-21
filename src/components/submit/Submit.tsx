import dynamic from "next/dynamic";

import { currentUser } from "@clerk/nextjs/server";

import { getYourCommunities } from "@/api/getCommunities";
import { getSelectedCommunity } from "@/api/getCommunity";
import SubmitActionButton from "@/components/submit/SubmitActionButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitTabs from "@/components/submit/SubmitTabs";

const SubmitCommunityDropdown = dynamic(
  () => import("@/components/submit/SubmitCommunityDropdown"),
);

export default async function Submit({
  params,
}: {
  params: { communityName?: string };
}) {
  const user = await currentUser();

  if (!user) throw new Error("Cannot read current user information.");

  const yourCommunitiesData = getYourCommunities.execute({
    currentUserId: user.id,
  });
  const selectedCommunityData = getSelectedCommunity.execute({
    communityName: params.communityName,
  });

  const [yourCommunities, selectedCommunity] = await Promise.all([
    yourCommunitiesData,
    selectedCommunityData,
  ]).catch(() => {
    throw new Error("There was a problem with loading user information.");
  });

  return (
    <>
      <SubmitCommunity selectedCommunity={selectedCommunity}>
        <SubmitCommunityDropdown
          username={user.username}
          imageUrl={user.imageUrl}
          yourCommunities={yourCommunities}
        />
      </SubmitCommunity>

      <div className="flex flex-col rounded bg-zinc-900">
        <SubmitTabs />
        <hr className="border-zinc-700/70" />
        <SubmitActionButton selectedCommunity={selectedCommunity} />
      </div>
    </>
  );
}
