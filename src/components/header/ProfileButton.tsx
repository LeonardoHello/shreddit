"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <Button
      className="flex items-center"
      onClick={async () => {
        await authClient.signOut({ fetchOptions: {} });

        router.refresh();
      }}
    >
      sign out
    </Button>
  );
}
