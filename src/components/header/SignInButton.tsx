import Link from "next/link";

import { Button } from "../ui/button";

export default function SignInButton() {
  return (
    <div className="flex items-center gap-2">
      <Button
        className="text-foreground rounded-full bg-rose-600 hover:bg-rose-600/90"
        disabled={true}
        asChild
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
