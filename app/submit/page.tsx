import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs";

import SubmitCommunity from "@/components/submit/SubmitCommunity";
import SubmitCommunityDropdown from "@/components/submit/SubmitCommunityDropdown";
import SubmitContent from "@/components/submit/SubmitContent";
import SubmitMenu from "@/components/submit/SubmitMenu";
import { getYourCommunities } from "@/lib/api/getCommunities";
import { getSelectedCommunity } from "@/lib/api/getCommunity";
import { getUserById } from "@/lib/api/getUser";
import SubmitContextProvider from "@/lib/context/SubmitContextProvider";
import ogre from "@/public/logo-green.svg";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  if (!userId) throw new Error("Cannot read current user information.");

  const userData = getUserById.execute({ currentUserId: userId });
  const yourCommunitiesData = getYourCommunities.execute({
    currentUserId: userId,
  });
  const initialSelectedCommunityData = getSelectedCommunity.execute({
    communityName: searchParams.community,
  });

  const [user, yourCommunities, initialSelectedCommunity] = await Promise.all([
    userData,
    yourCommunitiesData,
    initialSelectedCommunityData,
  ]).catch(() => {
    throw new Error("There was a problem with loading user information.");
  });

  if (!user) throw new Error("Cannot read current user information.");

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="mb-2 border-b border-zinc-700/70 py-2 text-lg font-medium tracking-wide">
          Create a post
        </h1>

        <SubmitContextProvider
          initialSelectedCommunity={initialSelectedCommunity}
          initialSubmit={searchParams.submit}
        >
          <SubmitCommunity>
            <SubmitCommunityDropdown
              user={user}
              yourCommunities={yourCommunities}
            />
          </SubmitCommunity>

          <div className="bg-zinc-900 text-sm">
            <SubmitMenu />
            <SubmitContent />
          </div>
        </SubmitContextProvider>
      </div>
      <div className="my-8 hidden flex-col gap-4 text-sm lg:flex">
        <div className="rounded bg-zinc-900 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Image src={ogre} alt="logo" className="h-8 w-8" />
            <h2 className="text-base font-medium">Posting to Shreddit</h2>
          </div>
          <div>
            <div className="border-b border-zinc-700/70 py-2">
              1. Remember the ogre
            </div>
            <div className="border-b border-zinc-700/70 py-2">
              2. Behave like you would in real swamp
            </div>
            <div className="border-b border-zinc-700/70 py-2">
              3. Look for the original source of content
            </div>
            <div className="border-b border-zinc-700/70 py-2">
              4. Search for duplicates before posting
            </div>
            <div className="border-b border-zinc-700/70 py-2">
              5. Read the community&apos;s rules
            </div>
          </div>
        </div>
        <div className="text-xs font-medium text-zinc-500">
          Please be mindful of shreddit&apos;s{" "}
          <Link
            href="https://utfs.io/f/6d2aac46-9ced-4376-abf4-d6be13b2a4ab-pmcoca.jpg"
            className="text-blue-500"
            target="_blank"
          >
            content policy
          </Link>{" "}
          and practice good{" "}
          <Link
            href="https://utfs.io/f/6d2aac46-9ced-4376-abf4-d6be13b2a4ab-pmcoca.jpg"
            className="text-blue-500"
            target="_blank"
          >
            shreddiquette
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
