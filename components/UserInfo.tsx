import CurrentFeed from "@/components/CurrentFeed";

export default async function UserInfo({ userId }: { userId: string }) {
  if (userId === null) throw new Error("Couldn't load user information");

  return (
    <CurrentFeed>
      <div>UserInfo</div>
    </CurrentFeed>
  );
}
