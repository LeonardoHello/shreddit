"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v3";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useTRPC } from "@/trpc/client";
import { RouterOutput } from "@/trpc/routers/_app";
import { Textarea } from "../ui/textarea";

type Community = NonNullable<RouterOutput["community"]["getCommunityByName"]>;

const displayNameMaxLength = 100;
const memberNicknameMaxLength = 21;
const descriptionMaxLength = 500;

const formSchema = z.object({
  displayName: z.string().trim().max(displayNameMaxLength),
  memberNickname: z.string().trim().max(memberNicknameMaxLength),
  description: z.string().trim().max(descriptionMaxLength),
});

export default function CommunityEditDialog({
  community,
}: {
  community: Community;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const communityQueryKey = trpc.community.getCommunityByName.queryKey();

  const editCommunity = useMutation(
    trpc.community.editCommunity.mutationOptions({
      onMutate: (variables) => {
        queryClient.setQueryData(communityQueryKey, (updater) => {
          if (!updater) {
            return community;
          }

          return {
            ...updater,
            displayName: variables.displayName,
            memberNickname: variables.memberNickname,
            description: variables.description,
          };
        });
      },
      onSuccess: () => {
        toast.success("Community successfully edited");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to edit your community. Please try again later.");
      },
    }),
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: community.displayName ?? "",
      description: community.description ?? "",
      memberNickname: community.memberNickname ?? "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    editCommunity.mutate({
      id: community.id,
      ...values,
    });
  }

  return (
    <DialogContent className="bg-card max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit community details widget</DialogTitle>
        <DialogDescription>
          Briefly describes your community and members. Always appears at the
          top of the sidebar.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input maxLength={displayNameMaxLength} {...field} />
                </FormControl>
                <FormDescription className="inline-flex w-full justify-between px-1">
                  <span>This is your public display name.</span>
                  <span>{displayNameMaxLength - field.value.length}</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="memberNickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Members&apos; nickname</FormLabel>
                <FormControl>
                  <Input maxLength={memberNicknameMaxLength} {...field} />
                </FormControl>
                <FormDescription className="inline-flex w-full justify-between px-1">
                  <span>Give a nickname to your members.</span>
                  <span>{memberNicknameMaxLength - field.value.length}</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community description</FormLabel>
                <FormControl>
                  <Textarea
                    maxLength={descriptionMaxLength}
                    {...field}
                    style={{
                      scrollbarWidth: "thin",
                      colorScheme: "dark",
                      scrollbarColor:
                        "hsl(var(--muted-foreground)) transparent",
                    }}
                  />
                </FormControl>
                <FormDescription className="inline-flex w-full justify-between px-1">
                  <span>Describe your community to visitors.</span>
                  <span>{descriptionMaxLength - field.value.length}</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant={"secondary"}
                className="rounded-full"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="rounded-full">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
