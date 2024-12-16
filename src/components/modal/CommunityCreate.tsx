"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import Modal from "./Modal";

const maxCommunityNameLength = 21;

export default function CommunityCreate() {
  const searchParams = useSearchParams();

  if (searchParams.get("submit") !== "community") {
    return null;
  }

  return <CommunityCreateContent />;
}

function CommunityCreateContent() {
  const router = useRouter();
  const pathname = usePathname();

  const nameRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [characeterCount, setCharaceterCount] = useState(
    maxCommunityNameLength,
  );

  const createCommunity = trpc.createCommunity.useMutation({
    onSuccess: (data) => {
      startTransition(() => {
        router.replace(`/r/${data[0].name}`);
      });
    },
  });

  const isMutating = isPending || createCommunity.isPending;

  const errorMessage = (error: NonNullable<typeof createCommunity.error>) => {
    if (
      error.data?.stack?.includes(
        "ERROR: duplicate key value violates unique constraint",
      )
    ) {
      return `Community name already exists`;
    }

    return error.data?.zodError?.formErrors[0] || error.message;
  };

  return (
    <Modal>
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-t border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-medium capitalize">create community</h1>
          <button onClick={() => router.replace(pathname, { scroll: false })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer transition-colors hover:text-zinc-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <hr className="border-zinc-700/70" />
        <div>
          <h2 className="font-medium capitalize">name</h2>
          <div className="flex items-center gap-2 text-zinc-500">
            <p className="text-xs">
              Community names including capitalization cannot be changed.
            </p>
            <div title='Names cannot have spaces (e.g., "r/bookclub" not "r/book club"), must be between 3-21 characters, and underscores ("_") are the only special characters allowed.'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="rgba(113,113,122,1)"
                className="min-w-[14px] cursor-help"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-3 tracking-wide text-zinc-500">
            r/
          </span>
          <input
            ref={nameRef}
            autoComplete="off"
            maxLength={maxCommunityNameLength}
            className="w-full min-w-0 rounded bg-inherit px-6 py-2 text-sm text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 focus:ring-zinc-300"
            onChange={(e) =>
              setCharaceterCount(
                maxCommunityNameLength - e.currentTarget.value.length,
              )
            }
          />
        </div>
        <div className="text-xs">
          <div
            className={cn("text-zinc-500", {
              "text-rose-500": characeterCount === 0,
            })}
          >
            {characeterCount} Characters remaining
          </div>
          {createCommunity.isError && (
            <div className="text-rose-500">
              {errorMessage(createCommunity.error)}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 rounded-b bg-zinc-800 px-4 py-3 text-sm font-bold">
        <button
          className="rounded-full border border-zinc-300 px-4 py-1 capitalize transition-colors hover:bg-zinc-600"
          onClick={() => router.replace(pathname, { scroll: false })}
        >
          cancel
        </button>
        <button
          className={cn(
            "rounded-full bg-zinc-300 px-4 py-1 capitalize text-zinc-950 transition-colors hover:bg-zinc-400",
            {
              "cursor-not-allowed opacity-60": isMutating,
            },
          )}
          disabled={isMutating}
          onClick={() => {
            if (isMutating || !nameRef.current) return;

            createCommunity.mutate(nameRef.current.value);
          }}
        >
          {isMutating ? "creating community..." : "create community"}
        </button>
      </div>
    </Modal>
  );
}
