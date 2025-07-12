"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { DiscordIcon, GithubIcon, GoogleIcon } from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import shrek from "@public/shrek.svg";

export default function ParallelSignInPage() {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="justify-center">
        <Image
          src={shrek}
          alt="shrek"
          className="size-10 justify-self-center"
        />
        <DialogHeader>
          <DialogTitle className="text-center">Welcome</DialogTitle>
          <DialogDescription className="text-center">
            Sign in with your favorite social provider
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
