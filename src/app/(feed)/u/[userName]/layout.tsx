import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { getUserByName } from "@/api/getUser";
import FeedSort from "@/components/feed/FeedSort";
import ScrollToTop from "@/components/sidebar/ScrollToTop";
import UserInfo from "@/components/user/UserInfo";
import UserNavigation from "@/components/user/UserNavigation";

export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const paramsPromise = props.params;
  const currentAuthPromise = auth();

  const [params, currentAuth] = await Promise.all([
    paramsPromise,
    currentAuthPromise,
  ]);

  const user = await getUserByName.execute({
    username: params.username,
  });

  if (user === undefined) return notFound();

  return (
    <>
      {user.id === currentAuth.userId && (
        <UserNavigation username={params.username} />
      )}

      <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
        <div className="flex flex-col gap-2.5">
          <FeedSort />
        </div>

        <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
          <UserInfo user={user} />
          <ScrollToTop />
        </div>

        {props.children}
      </div>
    </>
  );
}
