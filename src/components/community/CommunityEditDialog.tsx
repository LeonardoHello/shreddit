"use client";

import { useEffect, useReducer, useRef } from "react";
import Image from "next/image";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { Camera, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";
import * as v from "valibot";

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
import type { Community } from "@/db/schema/communities";
import { PostFileSchema } from "@/db/schema/posts";
import { client } from "@/hono/client";
import { useUploadThing } from "@/lib/uploadthing";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import defaultCommunityBanner from "@public/defaultCommunityBanner.jpg";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";

type CommunityType = InferResponseType<
  (typeof client.communities)[":communityName"]["$get"],
  200
>;

type ReducerState = {
  communityIcon: {
    file: File | null;
    url: string | null;
    placeholder: string | null;
  };
  communityBanner: {
    file: File | null;
    url: string | null;
    placeholder: string | null;
  };
  isLoading: boolean;
};

enum ReducerAction {
  SELECT_ICON,
  SELECT_BANNER,
  START_LOADING,
  STOP_LOADING,
}

type ReducerActionType =
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

const displayNameMaxLength = 100;
const memberNicknameMaxLength = 21;
const descriptionMaxLength = 500;

const formSchema = v.object({
  displayName: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(
      displayNameMaxLength,
      `Display name must be ${displayNameMaxLength} characters or less.`,
    ),
  ),
  memberNickname: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(
      memberNicknameMaxLength,
      `Nickname must be ${memberNicknameMaxLength} characters or less.`,
    ),
  ),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(
      descriptionMaxLength,
      `Description must be ${descriptionMaxLength} characters or less.`,
    ),
  ),
});

// file size limit in MB
const maxFileSize = 4;
const maxFileSizeInBytes = maxFileSize * 1024 * 1024; // convert to bytes

const toastId = "loading_toast";

export default function CommunityEditDialog({
  community,
}: {
  community: CommunityType;
}) {
  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    communityIcon: {
      file: null,
      url: community.icon,
      placeholder: community.iconPlaceholder,
    },
    communityBanner: {
      file: null,
      url: community.banner,
      placeholder: community.bannerPlaceholder,
    },
    isLoading: false,
  });

  useEffect(() => {
    if (iconInputRef.current && state.communityIcon.file === null) {
      iconInputRef.current.value = "";
    }

    if (bannerInputRef.current && state.communityBanner.file === null) {
      bannerInputRef.current.value = "";
    }
  }, [state.communityIcon.file, state.communityBanner.file]);

  const queryClient = getQueryClient();

  // 1. Define your form.
  const form = useForm<v.InferInput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      displayName: community.displayName ?? "",
      description: community.description ?? "",
      memberNickname: community.memberNickname ?? "",
    },
  });

  const handleBannerReset = () => {
    dispatch({
      type: ReducerAction.SELECT_BANNER,
      communityBanner: {
        file: null,
        url: community.banner,
        placeholder: community.bannerPlaceholder,
      },
    });
  };

  const handleIconReset = () => {
    dispatch({
      type: ReducerAction.SELECT_ICON,
      communityIcon: {
        file: null,
        url: community.icon,
        placeholder: community.iconPlaceholder,
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

  const editCommunity = useMutation({
    mutationFn: async ({
      id,
      ...rest
    }: Omit<Community, "createdAt" | "updatedAt" | "moderatorId" | "name">) => {
      await client.communities[`:communityId{${reg}}`].$patch({
        param: { communityId: id },
        json: rest,
      });
    },
    onMutate: (variables) => {
      const { id, ...rest } = variables;

      queryClient.setQueryData(["communities", community.name], (updater) => {
        if (!updater) {
          return community;
        }

        return { ...updater, ...rest };
      });

      dispatch({
        type: ReducerAction.SELECT_ICON,
        communityIcon: {
          file: null,
          url: rest.icon,
          placeholder: rest.iconPlaceholder,
        },
      });
      dispatch({
        type: ReducerAction.SELECT_BANNER,
        communityBanner: {
          file: null,
          url: rest.banner,
          placeholder: rest.bannerPlaceholder,
        },
      });
    },
    onSuccess: () => {
      toast.success("Community successfully edited");
    },
    onError: (error) => {
      queryClient.invalidateQueries({
        queryKey: ["communities", community.name],
      });

      handleIconReset();
      handleBannerReset();

      console.error(error);
      toast.error("Failed to edit your community. Please try again later.");
    },
  });

  const isMutating = isUploading || state.isLoading;

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

      let icon: Community["icon"] = community.icon;
      let iconPlaceholder: Community["iconPlaceholder"] =
        community.iconPlaceholder;

      let banner: Community["banner"] = community.banner;
      let bannerPlaceholder: Community["bannerPlaceholder"] =
        community.bannerPlaceholder;

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

      dispatch({ type: ReducerAction.STOP_LOADING });

      editCommunity.mutate({
        id: community.id,
        icon,
        iconPlaceholder,
        banner,
        bannerPlaceholder,
        ...values,
      });
    } else {
      dispatch({ type: ReducerAction.STOP_LOADING });

      editCommunity.mutate({
        id: community.id,
        icon: community.icon,
        iconPlaceholder: community.iconPlaceholder,
        banner: community.banner,
        bannerPlaceholder: community.bannerPlaceholder,
        ...values,
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
      communityIcon: {
        file,
        url: URL.createObjectURL(file),
        placeholder: URL.createObjectURL(file),
      },
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
      communityBanner: {
        file,
        url: URL.createObjectURL(file),
        placeholder: URL.createObjectURL(file),
      },
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
    <DialogContent className="bg-card max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit community details widget</DialogTitle>
        <DialogDescription>
          Briefly describes your community and members. Always appears at the
          top of the sidebar.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-1.5">
        <Label>Icon & Banner</Label>
        <div className="flex flex-col items-start">
          <div className="relative aspect-8/1 w-full">
            <Image
              src={state.communityBanner.url ?? defaultCommunityBanner}
              alt="community banner"
              placeholder="blur"
              blurDataURL={state.communityBanner.placeholder ?? undefined}
              fill
              className="rounded-md object-cover"
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
              placeholder="blur"
              blurDataURL={state.communityIcon.placeholder ?? undefined}
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
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
