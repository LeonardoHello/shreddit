import { notFound } from "next/navigation";

import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import { getUserByName } from "@/api/getUser";
import UserInfo from "@/components/user/UserInfo";
import UserNavigation from "@/components/user/UserNavigation";

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const [params, currentUser] = await Promise.all([
    props.params,
    currentUserPromise(),
  ]);

  const user = await getUserByName.execute({
    username: params.username,
  });

  if (user === undefined) return notFound();

  return (
    <>
      {currentUser && currentUser.id === user.id && (
        <UserNavigation username={params.username} />
      )}

      <div className="container mx-auto grid grid-cols-1 grid-rows-[auto,minmax(0,1fr)] gap-6 px-2 py-4 lg:grid-cols-[minmax(0,1fr),20rem] lg:pb-12 xl:max-w-6xl">
        <div className="row-span-2 hidden max-w-80 flex-col gap-4 text-sm lg:flex">
          <UserInfo user={user} />
        </div>

        {props.children}
      </div>
    </>
  );
}
