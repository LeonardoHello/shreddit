"use client";

import { authClient } from "@/lib/auth-client";
import { DiscordIcon, GithubIcon, GoogleIcon } from "./social-icons";
import { Button } from "./ui/button";

export default function SignInButtons() {
  return (
    <>
      <Button
        className="w-full sm:w-auto"
        variant={"outline"}
        onClick={async () => {
          await authClient.signIn.social({
            provider: "google",
          });
        }}
      >
        <GoogleIcon className="fill-foreground size-6" />
        Google
      </Button>

      <Button
        className="w-full sm:w-auto"
        variant={"outline"}
        onClick={async () => {
          await authClient.signIn.social({
            provider: "github",
          });
        }}
      >
        <GithubIcon className="fill-foreground size-6" />
        Github
      </Button>

      <Button
        className="w-full sm:w-auto"
        variant={"outline"}
        onClick={async () => {
          await authClient.signIn.social({
            provider: "discord",
          });
        }}
      >
        <DiscordIcon className="fill-foreground size-6" />
        Discord
      </Button>
    </>
  );
}
