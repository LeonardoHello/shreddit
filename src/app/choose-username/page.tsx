import UsernameForm from "@/components/username-form";
import { getSession } from "../actions";

export default async function ChooseUsernamePage() {
  const session = await getSession();

  if (!session) {
    throw new Error("Session not found.");
  }

  return (
    <UsernameForm userName={session.user.name} userImage={session.user.image} />
  );
}
