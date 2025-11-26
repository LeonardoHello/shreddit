"use client";

import { useReducer, useRef, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { Camera, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";
import * as v from "valibot";

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
import type { Community } from "@/db/schema/communities";
import { PostFileSchema } from "@/db/schema/posts";
import { client } from "@/hono/client";
import { useUploadThing } from "@/lib/uploadthing";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import defaultCommunityBanner from "@public/defaultCommunityBanner.jpg";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";

const nameMinLength = 3;
const nameMaxLength = 21;
const descriptionMaxLength = 500;

const formSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(
      nameMinLength,
      `Please lengthen this text to ${nameMinLength} characters or more`,
    ),
    v.maxLength(
      nameMaxLength,
      `Please shorten this text to ${nameMaxLength} characters or less`,
    ),
    v.regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and underscore are allowed",
    ),
  ),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(
      descriptionMaxLength,
      "Description is too long, shorten it to 300 characters or less",
    ),
  ),
});

type ReducerState = {
  errorMessage?: string;
  isOpen: boolean;
  communityIcon: { file: File | null; url: string | null };
  communityBanner: { file: File | null; url: string | null };
  isLoading: boolean;
};

enum ReducerAction {
  SET_ERROR_MESSAGE,
  REMOVE_ERROR_MESSAGE,
  SET_IS_OPEN,
  SELECT_ICON,
  SELECT_BANNER,
  START_LOADING,
  STOP_LOADING,
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
    }
  | {
      type: typeof ReducerAction.START_LOADING;
    }
  | {
      type: typeof ReducerAction.STOP_LOADING;
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
    case ReducerAction.START_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ReducerAction.STOP_LOADING: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default: {
      throw Error("Unknown action.");
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
    communityIcon: { file: null, url: null },
    communityBanner: { file: null, url: null },
    isLoading: false,
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const queryClient = getQueryClient();

  // 1. Define your form.
  const form = useForm<v.InferInput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleBannerReset = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
    dispatch({
      type: ReducerAction.SELECT_BANNER,
      communityBanner: {
        file: null,
        url: null,
      },
    });
  };

  const handleIconReset = () => {
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }

    dispatch({
      type: ReducerAction.SELECT_ICON,
      communityIcon: {
        file: null,
        url: null,
      },
    });
  };

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
        handleIconReset();
        handleBannerReset();

        toast.dismiss(toastId);
        toast.error(e.message);
      },
    },
  );

  const createCommunity = useMutation({
    mutationFn: async (
      community: Pick<
        Community,
        | "name"
        | "description"
        | "icon"
        | "iconPlaceholder"
        | "banner"
        | "bannerPlaceholder"
      >,
    ) => {
      const res = await client.communities.$post({
        json: community,
      });

      return res.json();
    },
    onMutate: () => {
      dispatch({ type: ReducerAction.START_LOADING });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "moderated"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "joined"],
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
          errorMessage: "Communtiy name is already taken. please try another.",
        });
      } else {
        toast.error("Failed to create a community. Please try again later.");
      }
    },
    onSettled: () => {
      dispatch({ type: ReducerAction.STOP_LOADING });
    },
  });

  const isMutating =
    isPending ||
    isUploading ||
    createCommunity.isPending ||
    form.formState.isSubmitting ||
    state.isLoading;

  // 2. Define a submit handler.
  async function onSubmit(values: v.InferInput<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (isMutating) {
      toast.error(
        "Cannot submit the form. Please check all required fields and try again.",
      );

      return;
    }
    dispatch({ type: ReducerAction.START_LOADING });

    if (state.communityIcon.file || state.communityBanner.file) {
      const filesToUpload = [];
      if (state.communityIcon.file) {
        filesToUpload.push(state.communityIcon.file);
      }
      if (state.communityBanner.file) {
        filesToUpload.push(state.communityBanner.file);
      }

      const uploadedFiles = await startUpload(filesToUpload);

      if (!uploadedFiles) {
        dispatch({ type: ReducerAction.STOP_LOADING });

        return;
      }

      const files = uploadedFiles.map((file) => ({
        name: file.name,
        key: file.key,
        url: file.ufsUrl,
      }));

      const response = await fetch("/api/thumbHash", {
        method: "POST",
        body: JSON.stringify(files),
      });

      const data = await response.json();

      const {
        output: parsedFiles,
        success,
        issues,
      } = v.safeParse(
        v.array(v.pick(PostFileSchema, ["key", "url", "name", "thumbHash"])),
        data,
      );

      if (!success) {
        toast.error(issues[0].message);
        dispatch({ type: ReducerAction.STOP_LOADING });

        return;
      }

      let icon: Community["icon"] = null;
      let iconPlaceholder: Community["iconPlaceholder"] = null;

      let banner: Community["banner"] = null;
      let bannerPlaceholder: Community["bannerPlaceholder"] = null;

      if (state.communityIcon.file && state.communityBanner.file) {
        // Both files uploaded, order preserved
        icon = parsedFiles[0].url;
        iconPlaceholder = parsedFiles[0].thumbHash;

        banner = parsedFiles[1].url;
        bannerPlaceholder = parsedFiles[1].thumbHash;
      } else if (state.communityIcon.file) {
        icon = parsedFiles[0].url;
        iconPlaceholder = parsedFiles[0].thumbHash;
      } else if (state.communityBanner.file) {
        banner = parsedFiles[0].url;
        bannerPlaceholder = parsedFiles[0].thumbHash;
      }

      createCommunity.mutate({
        ...values,
        icon: icon,
        iconPlaceholder,
        banner,
        bannerPlaceholder,
      });
    } else {
      createCommunity.mutate({
        ...values,
        icon: null,
        iconPlaceholder: null,
        banner: null,
        bannerPlaceholder: null,
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
    handleIconReset();
    handleBannerReset();

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
                src={state.communityBanner.url ?? defaultCommunityBanner}
                alt="community banner"
                className="rounded-md object-cover"
                fill
              />
              <Button
                className="absolute -top-4 -right-4 size-8 rounded-full"
                onClick={handleBannerReset}
              >
                <X className="size-4" />
              </Button>
              <label
                htmlFor="banner-upload"
                className="absolute -right-4 -bottom-4 cursor-pointer"
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
            <div className="relative -mt-6 ml-4">
              <Image
                src={state.communityIcon.url ?? defaultCommunityIcon}
                alt="communtiy icon"
                width={60}
                height={60}
                className="bg-card border-card aspect-square rounded-full border-2 object-cover"
              />
              <Button
                className="absolute -top-1 -right-2 size-6 rounded-full"
                onClick={handleIconReset}
              >
                <X className="size-3" />
              </Button>
              <label
                htmlFor="icon-upload"
                className="absolute -right-2 -bottom-1 cursor-pointer"
              >
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-6 items-center justify-center rounded-full">
                  <Camera className="size-3" />
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
                    <div className="text-muted-foreground ml-auto text-xs">
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
