import { headers } from "next/headers";
import { redirect } from "next/navigation";

import * as z from "zod/mini";

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

  const createdAt = z.parse(UserSchema.shape.createdAt, session.user.createdAt);

  return (
    <AccountPage
      createdAt={createdAt}
      name={session.user.name}
      image={session.user.image}
      username={username}
      email={session.user.email}
      provider={provider}
    />
  );
}
