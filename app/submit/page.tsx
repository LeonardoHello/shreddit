import Image from "next/image";
import Link from "next/link";

import { auth } from "@clerk/nextjs";

import CommunityCreate from "@/components/community/CommunityCreate";
import Modal from "@/components/shared/Modal";
import CommunitySelect from "@/components/submit/CommunitySelect";
import CommunitySelectDropdown from "@/components/submit/CommunitySelectDropdown";
import PostSubmit from "@/components/submit/PostSubmit";
import { getSelectableCommunities } from "@/lib/api/getCommunities";
import { getSelectedCommunity } from "@/lib/api/getCommunity";
import { getUserById } from "@/lib/api/getUser";
import SubmitContextProvider from "@/lib/context/SubmitContextProvider";
import ogre from "@/public/logo-green.svg";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId } = auth();

  if (!userId) throw new Error("Cannot read current user information.");

  const userData = getUserById.execute({ currentUserId: userId });
  const selectableCommunitiesData = getSelectableCommunities.execute({
    currentUserId: userId,
  });
  const initialSelectedCommunityData = getSelectedCommunity.execute({
    communityName: searchParams.community,
  });

  const [user, selectableCommunities, initialSelectedCommunity] =
    await Promise.all([
      userData,
      selectableCommunitiesData,
      initialSelectedCommunityData,
    ]).catch(() => {
      throw new Error("There was a problem with loading user information.");
    });

  if (!user) throw new Error("Cannot read current user information.");

  return (
    <>
      {searchParams.submit === "community" && (
        <Modal>
          <CommunityCreate />
        </Modal>
      )}
      <main className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
        <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
          <h1 className="border-b border-zinc-700/70 py-2 text-lg font-medium tracking-wide">
            Create a post
          </h1>

          <SubmitContextProvider
            initialSelectedCommunity={initialSelectedCommunity}
          >
            <CommunitySelect>
              <CommunitySelectDropdown
                user={user}
                selectableCommunities={selectableCommunities}
              />
            </CommunitySelect>
          </SubmitContextProvider>
        </div>
        <div className="my-8 hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
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
              href="https://utfs.io/f/13f13b19-107c-4ab7-85d9-10f4714529e2-pmcoca.jpg"
              className="text-blue-500"
              target="_blank"
            >
              content policy
            </Link>{" "}
            and practice good{" "}
            <Link
              href="https://utfs.io/f/13f13b19-107c-4ab7-85d9-10f4714529e2-pmcoca.jpg"
              className="text-blue-500"
              target="_blank"
            >
              shreddiquette
            </Link>
            .
          </div>
        </div>
      </main>
    </>
  );
}