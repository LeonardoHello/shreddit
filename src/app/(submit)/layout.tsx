import Image from "next/image";
import Link from "next/link";

import SubmitForm from "@/components/submit/SubmitForm";
import { Separator } from "@/components/ui/separator";
import SubmitContextProvider from "@/context/SubmitContext";
import { trpc } from "@/trpc/server";
import logo from "@public/logo.svg";

export default async function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void trpc.community.getMyCommunities.prefetch();

  return (
    <div className="container flex grow items-start gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <div className="flex w-0 grow flex-col gap-3 rounded-lg border bg-card px-4 py-3">
        <h1 className="text-2xl font-bold tracking-wide">Create post</h1>

        <SubmitContextProvider>
          <div className="flex flex-col gap-2">
            {children}
            <SubmitForm />
            <Separator />
          </div>
        </SubmitContextProvider>
      </div>

      <div className="sticky top-16 hidden h-fit w-80 flex-col gap-2.5 rounded-lg border bg-card p-4 text-sm lg:flex">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Image src={logo} alt="logo" className="size-8" />
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
