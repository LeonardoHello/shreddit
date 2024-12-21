import { createElement } from "react";
import dynamic from "next/dynamic";

import { User } from "@clerk/nextjs/server";

import { getYourCommunities } from "@/api/getCommunities";
import { getSelectedCommunity } from "@/api/getCommunity";
import SubmitActionButton from "@/components/submit/SubmitActionButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitTabs from "@/components/submit/SubmitTabs";
import { SameKeyValuePairRecord, SubmitType } from "@/types";

const SubmitRTE = dynamic(() => import("@/components/submit/SubmitRTE"));
const SubmitDropzone = dynamic(
  () => import("@/components/submit/SubmitDropzone"),
);
const SubmitCommunityDropdown = dynamic(
  () => import("@/components/submit/SubmitCommunityDropdown"),
);

export const submitTypeMap: SameKeyValuePairRecord<SubmitType> = {
  [SubmitType.TEXT]: SubmitType.TEXT,
  [SubmitType.IMAGE]: SubmitType.IMAGE,
};

// ensures that the correct component will render based on the "type" query parameter
const componentMap: Record<SubmitType, React.ComponentType> = {
  [SubmitType.TEXT]: SubmitRTE,
  [SubmitType.IMAGE]: SubmitDropzone,
};

export default async function Submit({
  user,
  searchParams,
  yourCommunities,
  selectedCommunity,
}: {
  user: User;
  searchParams: { type: SubmitType };
  yourCommunities: Awaited<ReturnType<typeof getYourCommunities.execute>>;
  selectedCommunity?: Awaited<ReturnType<typeof getSelectedCommunity.execute>>;
}) {
  // ensures that the TEXT tab is selected by default incase the "type" query parameter is not provided

  const currentType = submitTypeMap[searchParams.type] || SubmitType.TEXT;

  return (
    <>
      <SubmitCommunity selectedCommunity={selectedCommunity}>
        <SubmitCommunityDropdown
          username={user.username}
          imageUrl={user.imageUrl}
          yourCommunities={yourCommunities}
          searchParams={searchParams}
        />
      </SubmitCommunity>

      <div className="flex flex-col rounded bg-zinc-900">
        <SubmitTabs currentType={currentType}>
          {createElement(componentMap[currentType] || SubmitRTE)}
        </SubmitTabs>
        <hr className="border-zinc-700/70" />
        <SubmitActionButton
          selectedCommunity={selectedCommunity}
          currentType={currentType}
        />
      </div>
    </>
  );
}
