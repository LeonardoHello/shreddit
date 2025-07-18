"use client";

import { useReducer, useRef, useTransition } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { z } from "zod/v3";

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
import { useUploadThing } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import defaultCommunityBanner from "@public/defaultCommunityBanner.jpg";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";

const minNameLength = 3;
const maxNameLength = 21;
const maxDescriptionLength = 500;

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(minNameLength, {
      message: "Please lengthen this text to 3 characters or more",
    })
    .max(maxNameLength, {
      message: "Please shorten this text to 21 characters or less",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Only letters, numbers and underscore are allowed",
    }),
  description: z.string().trim().max(maxDescriptionLength, {
    message: "Description is too long, shorten it to 300 characters or less",
  }),
});

type ReducerState = {
  errorMessage?: string;
  isOpen: boolean;
  communityIcon: { file: File | undefined; url: string | StaticImport };
  communityBanner: { file: File | undefined; url: string | StaticImport };
};

enum ReducerAction {
  SET_ERROR_MESSAGE,
  REMOVE_ERROR_MESSAGE,
  SET_IS_OPEN,
  SELECT_ICON,
  SELECT_BANNER,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.SET_ERROR_MESSAGE;
      errorMessage: NonNullable<ReducerState["errorMessage"]>;
    }
  | {
      type: typeof ReducerAction.REMOVE_ERROR_MESSAGE;
    }
  | {
      type: typeof ReducerAction.SET_IS_OPEN;
      isOpen: ReducerState["isOpen"];
    }
  | {
      type: typeof ReducerAction.SELECT_ICON;
      communityIcon: ReducerState["communityIcon"];
    }
  | {
      type: typeof ReducerAction.SELECT_BANNER;
      communityBanner: ReducerState["communityBanner"];
    };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.SET_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    }
    case ReducerAction.REMOVE_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: undefined,
      };
    }
    case ReducerAction.SET_IS_OPEN: {
      return {
        ...state,
        isOpen: action.isOpen,
      };
    }
    case ReducerAction.SELECT_ICON: {
      return {
        ...state,
        communityIcon: action.communityIcon,
      };
    }
    case ReducerAction.SELECT_BANNER: {
      return {
        ...state,
        communityBanner: action.communityBanner,
      };
    }
  }
}

// file size limit in MB
const maxFileSize = 4;
const maxFileSizeInBytes = maxFileSize * 1024 * 1024; // convert to bytes

const toastId = "loading_toast";

export default function SidebarDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    communityIcon: { file: undefined, url: defaultCommunityIcon },
    communityBanner: { file: undefined, url: defaultCommunityBanner },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const fileSelectedReset = () => {
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
    dispatch({
      type: ReducerAction.SELECT_ICON,
      communityIcon: { file: undefined, url: defaultCommunityIcon },
    });

    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
    dispatch({
      type: ReducerAction.SELECT_BANNER,
      communityBanner: { file: undefined, url: defaultCommunityBanner },
    });
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "imageUploader",
    {
      onUploadProgress: (p) => {
        toast.info(<Progress value={p} />, {
          id: toastId,
          // in milliseconds
          duration: 99 * 1000,
        });
      },
      onClientUploadComplete: () => {
        toast.dismiss(toastId);
      },
      onUploadError: (e) => {
        fileSelectedReset();

        toast.dismiss(toastId);
        toast.error(e.message);
      },
    },
  );

  const createCommunity = useMutation(
    trpc.community.createCommunity.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.community.getModeratedCommunities.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.community.getJoinedCommunities.queryKey(),
        });

        startTransition(() => {
          router.replace(`/r/${data[0][0].name}`);
          form.reset();

          dispatch({
            type: ReducerAction.SET_IS_OPEN,
            isOpen: false,
          });
        });
      },
      onError: (error) => {
        if (
          error.message ===
          'duplicate key value violates unique constraint "communities_name_unique"'
        ) {
          dispatch({
            type: ReducerAction.SET_ERROR_MESSAGE,
            errorMessage:
              "Communtiy name is already taken. please try another.",
          });
        } else {
          toast.error("Failed to create a community. Please try again later.");
        }
      },
    }),
  );

  const isMutating =
    isPending ||
    isUploading ||
    createCommunity.isPending ||
    form.formState.isSubmitting;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (isMutating) {
      toast.error(
        "Cannot submit the form. Please check all required fields and try again.",
      );

      return;
    }

    if (state.communityIcon.file || state.communityBanner.file) {
      const filesToUpload = [];
      if (state.communityIcon.file) {
        filesToUpload.push(state.communityIcon.file);
      }
      if (state.communityBanner.file) {
        filesToUpload.push(state.communityBanner.file);
      }

      const uploadedFiles = await startUpload(filesToUpload);

      if (uploadedFiles) {
        let iconUrl: string | null = null;
        let bannerUrl: string | null = null;

        if (state.communityIcon.file && state.communityBanner.file) {
          // Both files uploaded, order preserved
          iconUrl = uploadedFiles[0].ufsUrl;
          bannerUrl = uploadedFiles[1].ufsUrl;
        } else if (state.communityIcon.file) {
          iconUrl = uploadedFiles[0].ufsUrl;
        } else if (state.communityBanner.file) {
          bannerUrl = uploadedFiles[0].ufsUrl;
        }

        createCommunity.mutate({
          ...values,
          icon: iconUrl,
          banner: bannerUrl,
        });
      }
    } else {
      createCommunity.mutate({
        ...values,
        icon: null,
        banner: null,
      });
    }
  }

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSizeInBytes) {
      toast.error(`File size exceeds the maximum limit of ${maxFileSize}MB`);
      return;
    }

    dispatch({
      type: ReducerAction.SELECT_ICON,
      communityIcon: { file, url: URL.createObjectURL(file) },
    });
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSizeInBytes) {
      toast.error(`File size exceeds the maximum limit of ${maxFileSize}MB`);
      return;
    }

    dispatch({
      type: ReducerAction.SELECT_BANNER,
      communityBanner: { file, url: URL.createObjectURL(file) },
    });
  };

  const handleFormReset = () => {
    fileSelectedReset();

    form.reset();
  };

  const permittedFileTypes = generatePermittedFileTypes(routeConfig);
  const mimeTypes = generateMimeTypes(permittedFileTypes.fileTypes);

  return (
    <Dialog
      onOpenChange={(open) => {
        dispatch({
          type: ReducerAction.SET_IS_OPEN,
          isOpen: open,
        });
      }}
      open={state.isOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tell us about your community</DialogTitle>
          <DialogDescription>
            A name and description help people understand what your community is
            all about.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label>Icon & Banner</Label>
          <div className="flex flex-col items-start">
            <div className="relative aspect-8/1 w-full">
              <Image
                src={state.communityBanner.url}
                alt="community banner"
                className="rounded-md object-cover"
                fill
              />
              <label
                htmlFor="banner-upload"
                className="absolute -right-2 -bottom-2 cursor-pointer"
              >
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-8 items-center justify-center rounded-full">
                  <Camera className="size-4" />
                </div>
                <input
                  ref={bannerInputRef}
                  id="banner-upload"
                  type="file"
                  accept={mimeTypes.join(", ")}
                  multiple={false}
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <div className="relative -mt-6 px-4">
              <Image
                src={state.communityIcon.url}
                alt="communtiy icon"
                width={60}
                height={60}
                className="bg-card border-card aspect-square rounded-full border-2 object-contain"
              />
              <label
                htmlFor="icon-upload"
                className="absolute right-1 -bottom-1 cursor-pointer"
              >
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-7 items-center justify-center rounded-full">
                  <Camera className="size-3.5" />
                </div>
                <input
                  ref={iconInputRef}
                  id="icon-upload"
                  type="file"
                  accept={mimeTypes.join(", ")}
                  multiple={false}
                  className="hidden"
                  onChange={handleIconUpload}
                />
              </label>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{
                onChange: () => {
                  dispatch({
                    type: ReducerAction.REMOVE_ERROR_MESSAGE,
                  });
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Community name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <div className="inline-flex w-full justify-between px-1">
                    <FormMessage>{state.errorMessage}</FormMessage>
                    <div className="text-muted-foreground ml-auto text-xs">
                      {maxNameLength - field.value.length}
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
                    <div className="text-muted-foreground ml-auto text-xs">
                      {maxDescriptionLength - field.value.length}
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
                  onClick={handleFormReset}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="rounded-full"
                disabled={isMutating}
              >
                {isMutating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Creating..."}
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
