"use client";

import Image from "next/image";

import { DiscordIcon, GithubIcon, GoogleIcon } from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import shrek from "@public/shrek.svg";

export default function SignInPage() {
  return (
    <div className="container flex grow flex-col items-center justify-center gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <Image src={shrek} alt="shrek" />
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in with your favorite social provider
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
