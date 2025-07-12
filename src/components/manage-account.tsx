"use client";

import { createElement, useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Info, Loader2, Lock, Mail, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  generateMimeTypes,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { z } from "zod/v3";

import { deleteAccount } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/db/schema/users";
import { authClient } from "@/lib/auth-client";
import { useUploadThing } from "@/lib/uploadthing";
import donkes from "@public/donkey.png";
import { DiscordIcon, GithubIcon, GoogleIcon } from "./social-icons";
import { Progress } from "./ui/progress";

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
  selectedFile: z.instanceof(File).optional(),
});

type ReducerState = {
  errorMessage?: string;
  isLoading: boolean;
  displayImage: string;
};

enum ReducerAction {
  SET_ERROR_MESSAGE,
  REMOVE_ERROR_MESSAGE,
  SET_DISPLAY_IMAGE,
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
      type: typeof ReducerAction.SET_DISPLAY_IMAGE;
      displayImage: ReducerState["displayImage"];
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
    case ReducerAction.SET_DISPLAY_IMAGE: {
      return {
        ...state,
        displayImage: action.displayImage,
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

const toastId = "loading_toast";

const description =
  "Username must be 3-21 characters long and contain only alphanumeric characters, underscores, and dots.";

export default function AccountPage({
  name,
  createdAt,
  email,
  username,
  image,
  provider,
}: {
  name: User["name"];
  createdAt: User["createdAt"];
  email: User["email"];
  username: NonNullable<User["username"]>;
  image: User["image"] | undefined;
  provider: "github" | "discord" | "google" | undefined;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    displayImage: image ?? donkes.src,
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username,
    },
    disabled: isPending || state.isLoading,
  });

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "userImageUploader",
    {
      onUploadProgress: (p) => {
        toast.info(<Progress value={p} />, {
          id: toastId,
          duration: 1000 * 99,
        });
      },
      onClientUploadComplete: (res) => {
        form.setValue("selectedFile", undefined);

        dispatch({
          type: ReducerAction.SET_DISPLAY_IMAGE,
          displayImage: res[0].ufsUrl,
        });

        toast.dismiss(toastId);
      },
      onUploadError: (e) => {
        dispatch({
          type: ReducerAction.SET_DISPLAY_IMAGE,
          displayImage: image ?? donkes.src,
        });

        toast.dismiss(toastId);
        toast.error(e.message);
      },
    },
  );

  const isDisabled =
    form.getValues("username") === username &&
    (!form.getValues("selectedFile") || state.displayImage === image);

  const isMutating =
    isPending || isUploading || state.isLoading || form.formState.isSubmitting;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (!isDisabled && !isMutating) {
      dispatch({
        type: ReducerAction.START_LOADING,
      });

      const uploadedFile =
        values.selectedFile && state.displayImage !== image
          ? await startUpload([values.selectedFile])
          : undefined;

      authClient.updateUser({
        username: values.username !== username ? values.username : undefined,
        image: uploadedFile && uploadedFile[0].ufsUrl,
        fetchOptions: {
          onSuccess: () => {
            startTransition(() => {
              router.refresh();
            });
          },
          onError: (error) => {
            dispatch({
              type: ReducerAction.SET_ERROR_MESSAGE,
              errorMessage: error.error.message,
            });
          },
          onResponse: () => {
            dispatch({
              type: ReducerAction.STOP_LOADING,
            });
          },
        },
      });
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      form.setValue("selectedFile", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({
          type: ReducerAction.SET_DISPLAY_IMAGE,
          displayImage: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    // Handle account deletion logic here
    const response = await deleteAccount();

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  const providerIcon = {
    google: GoogleIcon,
    github: GithubIcon,
    discord: DiscordIcon,
  };

  const permittedFileTypes = generatePermittedFileTypes(routeConfig);

  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto max-w-4xl space-y-8 p-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarImage
                    className="object-cover"
                    src={state.displayImage}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="text-lg uppercase">
                    {username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute -right-2 -bottom-2 cursor-pointer"
                >
                  <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 w-8 items-center justify-center rounded-full">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept={generateMimeTypes(
                      permittedFileTypes.fileTypes,
                    ).join(", ")}
                    multiple={permittedFileTypes.multiple}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium">{name}</h3>
                <p className="text-muted-foreground text-sm">
                  Member since{" "}
                  {createdAt.toLocaleDateString("en-HR", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Editable Fields */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="username"
                    rules={{
                      onChange: () => {
                        dispatch({
                          type: ReducerAction.REMOVE_ERROR_MESSAGE,
                        });
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

                        <FormMessage>{state.errorMessage}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="flex items-center gap-2"
                    >
                      Email Address
                      <Lock className="text-muted-foreground size-3" />
                    </FormLabel>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      readOnly
                      className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                    />
                  </FormItem>
                </div>

                {/* Social Provider */}
                <div className="space-y-2">
                  <Label>Sign-in Provider</Label>
                  <div className="flex items-center gap-2">
                    {provider ? (
                      <>
                        <Badge className="flex items-center gap-1">
                          {createElement(providerIcon[provider], {
                            className: "size-3",
                          })}
                          {provider}
                        </Badge>
                        <span className="text-muted-foreground text-2xs">
                          •
                        </span>
                        <span className="text-muted-foreground text-sm">
                          You signed up using {provider}
                        </span>
                      </>
                    ) : (
                      <>
                        <Badge className="flex items-center gap-1">
                          <Mail className="size-3 stroke-[2.5]" />
                          email
                        </Badge>
                        <span className="text-muted-foreground text-2xs">
                          •
                        </span>
                        <span className="text-muted-foreground text-sm">
                          You signed up using your email address
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-min self-end"
                  disabled={isMutating || isDisabled}
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-destructive/20 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="size-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
