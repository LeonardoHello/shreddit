import { Suspense } from "react";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";

import { getMyCommunities } from "@/api/getCommunities";
import { getSelectedCommunity } from "@/api/getCommunity";
import SubmitButton from "@/components/submit/SubmitButton";
import SubmitCommunityDropdown from "@/components/submit/SubmitCommunityDropdown";
import SubmitCommunitySelected from "@/components/submit/SubmitCommunitySelected";
import SubmitTabs from "@/components/submit/SubmitTabs";
import DropdownContextProvider from "@/context/DropdownContext";

export default async function CommunitySubmitPage(props: {
  params: Promise<{ communityName: string }>;
}) {
  const user = await currentUser();

  if (!user) throw new Error("Cannot read current user information.");

  const myCommunitiesPromise = getMyCommunities.execute({
    currentUserId: user.id,
  });

  const params = await props.params;

  const selectedCommunityPromise = getSelectedCommunity.execute({
    communityName: params.communityName,
  });

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="mb-2 border-b border-zinc-700/70 py-2 text-lg font-medium tracking-wide">
          Create a post
        </h1>

        <DropdownContextProvider className="relative max-w-min">
          <Suspense fallback={<p>Loading...</p>}>
            <SubmitCommunitySelected
              selectedCommunityPromise={selectedCommunityPromise}
            >
              <Suspense fallback={<p>Loading...</p>}>
                <SubmitCommunityDropdown
                  username={user.username}
                  imageUrl={user.imageUrl}
                  myCommunitiesPromise={myCommunitiesPromise}
                />
              </Suspense>
            </SubmitCommunitySelected>
          </Suspense>
        </DropdownContextProvider>

        <div className="flex flex-col rounded bg-zinc-900">
          <SubmitTabs />
          <hr className="border-zinc-700/70" />
          <Suspense fallback={<p>Loading...</p>}>
            <SubmitButton selectedCommunityPromise={selectedCommunityPromise} />
          </Suspense>
        </div>
      </div>

      <div className="my-8 hidden flex-col gap-4 text-sm lg:flex">
        <div className="rounded bg-zinc-900 p-4">
          <div className="mb-2 flex items-center gap-2">
            <LogoIcon className="size-8 fill-green-500" />
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
            href="https://8t3elu199k.ufs.sh/f/g5bSfwFnFPCkRkEFEiqpn1qKl6SiV3r29vPEcIbwQWhFJLda"
            className="text-blue-500"
            target="_blank"
          >
            content policy
          </Link>{" "}
          and practice good{" "}
          <Link
            href="https://8t3elu199k.ufs.sh/f/g5bSfwFnFPCkBi3Y10kkBcL4w7KYtTz1H053rVO2JmXuq9AF"
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

function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="96.000000pt"
      height="96.000000pt"
      viewBox="0 0 96.000000 96.000000"
      preserveAspectRatio="xMidYMid meet"
      fill="#fff"
    >
      <circle cx="48" cy="41.8" r="33.2" fill="#fff" />
      <g
        transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
        fill="#f43f5e"
        stroke="none"
      >
        <path
          d="M415 954 c-119 -18 -243 -92 -315 -188 -178 -236 -94 -585 172 -711
 388 -184 797 187 654 593 -44 123 -163 240 -288 281 -65 21 -170 33 -223 25z
 m169 -238 c20 -15 46 -45 57 -68 l21 -41 42 42 c48 47 73 52 82 16 8 -34 -1
 -55 -26 -55 -12 0 -34 -7 -50 -15 l-28 -15 5 -99 c6 -94 4 -103 -21 -154 -17
 -36 -40 -64 -68 -83 -37 -26 -50 -29 -118 -29 -68 0 -81 3 -118 29 -27 19 -51
 47 -68 82 -24 50 -26 62 -23 157 l4 102 -50 16 c-53 18 -60 27 -51 64 9 36 34
 31 82 -16 l42 -42 20 39 c38 75 93 107 174 101 42 -2 65 -10 92 -31z"
        />
        <path
          d="M375 600 c-10 -11 -13 -20 -7 -20 7 0 12 5 12 10 0 6 9 10 20 10 11
 0 20 -5 20 -12 0 -6 3 -8 6 -5 7 7 -14 37 -26 37 -4 0 -15 -9 -25 -20z"
        />
        <path
          d="M540 605 c-7 -9 -10 -18 -6 -22 3 -3 6 -1 6 5 0 7 9 12 20 12 11 0
 20 -4 20 -10 0 -5 5 -10 12 -10 6 0 3 9 -7 20 -22 24 -29 25 -45 5z"
        />
        <path
          d="M440 529 c-47 -25 -46 -51 3 -61 54 -11 112 3 112 27 0 13 -8 21 -22
 23 -12 2 -27 10 -33 18 -15 17 -15 17 -60 -7z"
        />
        <path
          d="M395 390 c22 -21 35 -25 85 -25 50 0 63 4 85 25 l25 25 -110 0 -110
 0 25 -25z"
        />
      </g>
    </svg>
  );
}
