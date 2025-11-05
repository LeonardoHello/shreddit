import { redirect } from "next/navigation";

import { getSession } from "../actions";

export const runtime = "edge";
export const preferredRegion = "fra1";

export default async function ChooseUsernamelayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session && !session.user.username) {
    return children;
  }

  redirect("/");
}
