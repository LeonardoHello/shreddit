"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import donkey from "@public/donkey.png";
import shrek from "@public/shrek.svg";

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(21, { message: "Username must be at most 21 characters long" })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message:
        "Username can only contain alphanumeric characters, underscores, and dots",
    }),
});

const description =
  "Username must be 3-21 characters long and contain only alphanumeric characters, underscores, and dots.";

export default function UsernameForm({
  userName,
  userImage,
}: {
  userName: string;
  userImage: string | null | undefined;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setIsLoading(true);

    authClient.updateUser({
      username: values.username,
      fetchOptions: {
        onSuccess: () => {
          startTransition(() => {
            router.replace("/");
          });
        },
        onError: (error) => {
          setError(error.error.message);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    });
  }

  const isMutating = isPending || isLoading || form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with logout button */}
      <header className="bg-card flex h-16 items-center justify-between border-b px-4">
        <Image src={shrek} alt="shrek icon" className="size-10" />
        <Button
          variant="outline"
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.refresh();
                },
              },
            });
          }}
        >
          <LogOut />
          Log out
        </Button>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Avatar className="mx-auto mb-4 size-12">
              <AvatarImage src={userImage ?? donkey.src} />
              <AvatarFallback className="uppercase">
                {userName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <CardTitle className="text-2xl font-bold">
              Choose Username
            </CardTitle>
            <CardDescription>
              Choose a unique username for your account. This will be how others
              identify you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  rules={{
                    onChange: () => {
                      setError(null);
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor="username">Username</FormLabel>
                        {/* Desktop only info */}
                        <Tooltip>
                          <TooltipTrigger
                            asChild
                            className="hidden md:inline-block"
                          >
                            <Info className="size-4 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <FormDescription className="text-gray-700">
                              {description}
                            </FormDescription>
                          </TooltipContent>
                        </Tooltip>

                        {/* Mobile only info */}
                        <Popover>
                          <PopoverTrigger asChild className="md:hidden">
                            <Info className="size-4 text-gray-500" />
                          </PopoverTrigger>
                          <PopoverContent align="end">
                            <FormDescription>{description}</FormDescription>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage>{error}</FormMessage>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isMutating}>
                  {isMutating && <Loader2 className="size-4 animate-spin" />}
                  {isMutating ? "Creating..." : "Create Username"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
