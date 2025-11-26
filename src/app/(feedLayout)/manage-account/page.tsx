import { headers } from "next/headers";
import { redirect } from "next/navigation";

import * as v from "valibot";

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

  const username = v.parse(
    UserSchema.entries.username.wrapped,
    session.user.username,
  );

  const provider = v.safeParse(
    v.picklist(["google", "github", "discord"]),
    account.providerId,
  );

  const createdAt = v.parse(
    UserSchema.entries.createdAt,
    session.user.createdAt,
  );

  return (
    <AccountPage
      createdAt={createdAt}
      name={session.user.name}
      image={session.user.image}
      username={username}
      email={session.user.email}
      provider={provider.success ? provider.output : undefined}
    />
  );
}
