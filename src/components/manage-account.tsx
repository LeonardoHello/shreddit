"use client";

import { createElement, useCallback, useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "@uploadthing/react";
import { Camera, Info, Loader2, Lock, Mail, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { z } from "zod/v3";

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
});

type ReducerState = {
  errorMessage: string | null;
  isLoading: boolean;
  displayImage: string;
  uploadedImage: string | null;
};

enum ReducerAction {
  SET_ERROR_MESSAGE,
  REMOVE_ERROR_MESSAGE,
  SET_DISPLAY_IMAGE,
  SET_UPLOADED_IMAGE,
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
      type: typeof ReducerAction.SET_UPLOADED_IMAGE;
      uploadedImage: NonNullable<ReducerState["uploadedImage"]>;
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
        errorMessage: null,
      };
    }
    case ReducerAction.SET_DISPLAY_IMAGE: {
      return {
        ...state,
        displayImage: action.displayImage,
      };
    }
    case ReducerAction.SET_UPLOADED_IMAGE: {
      return {
        ...state,
        uploadedImage: action.uploadedImage,
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
    errorMessage: null,
    isLoading: false,
    displayImage: image ?? donkes.src,
    uploadedImage: null,
  });

  const providerIcon = {
    google: GoogleIcon,
    github: GithubIcon,
    discord: DiscordIcon,
  };

  const handleImageUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username,
    },
    disabled: isPending || state.isLoading,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    dispatch({
      type: ReducerAction.START_LOADING,
    });

    authClient.updateUser({
      username: values.username === username ? undefined : values.username,
      image: state.uploadedImage ?? undefined,
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

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    "userImageUploader",
    {
      onBeforeUploadBegin: (files) => {
        handleImageUpload(files);
        return files;
      },
      onUploadProgress: (p) => {
        toast.info(<Progress value={p} />, {
          id: toastId,
          duration: 1000 * 99,
        });
      },
      onClientUploadComplete: (res) => {
        dispatch({
          type: ReducerAction.SET_UPLOADED_IMAGE,
          uploadedImage: res[0].ufsUrl,
        });
        toast.dismiss(toastId);
      },
      onUploadError: (e) => {
        dispatch({
          type: ReducerAction.SET_DISPLAY_IMAGE,
          displayImage: state.displayImage,
        });

        toast.dismiss(toastId);
        toast.error(e.message);
      },
    },
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  const isMutating =
    isPending || state.isLoading || form.formState.isSubmitting || isUploading;

  const isDisabled =
    form.getValues("username") === username && !state.uploadedImage;

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Deleting account...");
  };

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
                <div
                  {...getRootProps()}
                  className="absolute -right-2 -bottom-2 cursor-pointer rounded-full"
                >
                  <input {...getInputProps()} />
                  <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-8 items-center justify-center rounded-full">
                    <Camera className="size-4" />
                  </div>
                </div>
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
                  {isMutating && <Loader2 className="size-4 animate-spin" />}
                  {isMutating && isUploading
                    ? "Uploading..."
                    : isMutating
                      ? "Saving..."
                      : "Save Changes"}
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
                    <Trash2 className="mr-2 size-4" />
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

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Discord</title>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}
