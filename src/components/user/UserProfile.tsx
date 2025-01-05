import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { UserIcon } from "@heroicons/react/24/solid";

export default function UserProfile() {
  return (
    <div className="order-2 flex items-center self-center">
      <ClerkLoading>
        <UserIcon className="h-8 w-8 animate-pulse rounded-full bg-zinc-300 p-0.5 text-zinc-800 opacity-80" />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>
    </div>
  );
}
