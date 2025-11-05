import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod/v4";

import { getSession } from "@/app/actions";
import AccountPage from "@/components/manage-account";
import { UserSchema } from "@/db/schema/users";
import { auth } from "@/lib/auth";

export default async function ManageAccountPage() {
  const [[account], session] = await Promise.all([
    auth.api.listUserAccounts({ headers: await headers() }),
    getSession(),
  ]);

  if (!session) {
    redirect("/");
  }

  const username = z.parse(
    UserSchema.shape.username.unwrap(),
    session.user.username,
  );

  const { data: provider } = z.safeParse(
    z.enum(["google", "github", "discord"]),
    account.providerId,
  );

  return (
    <AccountPage
      createdAt={session.user.createdAt}
      name={session.user.name}
      image={session.user.image}
      username={username}
      email={session.user.email}
      provider={provider}
    />
  );
}
