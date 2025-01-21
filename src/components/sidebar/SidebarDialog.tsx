"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const nameMaxLength = 21;
const descriptionMaxLength = 500;

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Please lengthen this text to 3 characters or more",
    })
    .max(nameMaxLength, {
      message: "Please shorten this text to 21 characters or less",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Only letters, numbers and underscore are allowed",
    }),
  description: z.string().trim().max(descriptionMaxLength, {
    message: "Description is too long",
  }),
});

export default function SidebarDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createCommunity = trpc.community.createCommunity.useMutation({
    onSuccess: (data) => {
      startTransition(() => {
        router.replace(`/r/${data[0].name}`);
        setIsOpen(false);
        form.reset();
      });
    },
    onError: (error) => {
      if (
        error.message ===
        'duplicate key value violates unique constraint "communities_name_unique"'
      ) {
        const values = form.getValues();
        toast.error(`"r/${values.name}" is already taken`);
      } else {
        toast.error(error.message);
      }
    },
  });

  // 1. Define your form.

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    createCommunity.mutate(values);
  }

  const isMutating =
    isPending || createCommunity.isPending || form.formState.isSubmitting;

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
        >
          <Plus className="size-8 stroke-1" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Tell us about your community</DialogTitle>
          <DialogDescription>
            A name and description help people understand what your community is
            all about.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Community name <span className="text-rose-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={nameMaxLength} />
                  </FormControl>
                  <div className="inline-flex w-full justify-between px-1">
                    <FormMessage />
                    <div className="ml-auto text-xs text-muted-foreground">
                      {nameMaxLength - field.value.length}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      style={{
                        resize: "none",
                        scrollbarWidth: "thin",
                        colorScheme: "dark",
                      }}
                    />
                  </FormControl>
                  <div className="inline-flex w-full px-1">
                    <FormMessage />
                    <div className="ml-auto text-xs text-muted-foreground">
                      {descriptionMaxLength - field.value.length}
                    </div>
                  </div>
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
              <Button
                type="submit"
                className="rounded-full"
                disabled={isMutating}
              >
                {isMutating && <Loader2 className="size-4 animate-spin" />}
                {!isMutating && "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
