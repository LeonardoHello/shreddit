import { permanentRedirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs";

export default async function UserNavigationLayout({
  children,
  params: { userName },
}: {
  children: React.ReactNode;
  params: { userName: string };
}) {
  const user = await currentUser();

  if (user?.username !== userName) permanentRedirect;

  return <>{children}</>;
}
