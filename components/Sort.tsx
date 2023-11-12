import Image from "next/image";

import { currentUser } from "@clerk/nextjs";

export default async function Sort() {
  const user = await currentUser();

  if (user === null) throw new Error("Could not load users information.");

  return (
    <div>
      <Image
        src={user.imageUrl}
        alt="user image"
        width={48}
        height={48}
        className="rounded-full"
        priority
      />
    </div>
  );
}
