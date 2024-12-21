import { createElement } from "react";
import dynamic from "next/dynamic";

import { User } from "@clerk/nextjs/server";

import { getYourCommunities } from "@/api/getCommunities";
import { getSelectedCommunity } from "@/api/getCommunity";
import SubmitActionButton from "@/components/submit/SubmitActionButton";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitTabs from "@/components/submit/SubmitTabs";
import { PostType, SameKeyValuePairRecord } from "@/types";

const SubmitRTE = dynamic(() => import("@/components/submit/SubmitRTE"));
const SubmitDropzone = dynamic(
  () => import("@/components/submit/SubmitDropzone"),
);
const SubmitCommunityDropdown = dynamic(
  () => import("@/components/submit/SubmitCommunityDropdown"),
);

export const postTypeMap: SameKeyValuePairRecord<PostType> = {
  [PostType.TEXT]: PostType.TEXT,
  [PostType.IMAGE]: PostType.IMAGE,
};

// ensures that the correct component will render based on the "type" query parameter
const componentMap: Record<PostType, React.ComponentType> = {
  [PostType.TEXT]: SubmitRTE,
  [PostType.IMAGE]: SubmitDropzone,
};

export default async function Submit({
  user,
  searchParams,
  yourCommunities,
  selectedCommunity,
}: {
  user: User;
  searchParams: { type: PostType };
  yourCommunities: Awaited<ReturnType<typeof getYourCommunities.execute>>;
  selectedCommunity?: Awaited<ReturnType<typeof getSelectedCommunity.execute>>;
}) {
  // ensures that the TEXT tab is selected by default incase the "type" query parameter is not provided

  const postType = postTypeMap[searchParams.type] || PostType.TEXT;

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
        <SubmitTabs postType={postType}>
          {createElement(componentMap[postType] || SubmitRTE)}
        </SubmitTabs>
        <hr className="border-zinc-700/70" />
        <SubmitActionButton
          selectedCommunity={selectedCommunity}
          postType={postType}
        />
      </div>
    </>
  );
}
