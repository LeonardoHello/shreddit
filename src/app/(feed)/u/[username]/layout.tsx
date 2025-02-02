import { notFound } from "next/navigation";

import UserHeader from "@/components/user/UserHeader";
import UserSidebar from "@/components/user/UserSidebar";
import { trpc } from "@/trpc/server";

export default async function UserLayout(props: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const user = await trpc.user.getUserByName(params.username);

  if (!user) notFound();

  return (
    <main className="container flex grow flex-col gap-4 p-2 pb-6 xl:max-w-[992px] 2xl:max-w-[1080px]">
      <UserHeader user={user} />

      <div className="flex justify-center gap-4">
        {props.children}

        <UserSidebar user={user} />
      </div>
    </main>
  );
}
