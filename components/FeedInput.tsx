import Image from "next/image";

import { currentUser } from "@clerk/nextjs";

export default async function InputSubmit() {
  const user = await currentUser();

  if (user === null) return null;

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
