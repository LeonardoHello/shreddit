import Link from "next/link";

import { Button } from "../ui/button";

export default function SignInButton() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
