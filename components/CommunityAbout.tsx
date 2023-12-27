"use client";

import { useRef, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { CakeIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { getCommunity } from "@/lib/api/getCommunity";
import { User } from "@/lib/db/schema";
import useDropdown from "@/lib/hooks/useDropdown";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";

import CommunityOptions from "./CommunityOptions";

export default function CommunityAbout({
  community,
  currentUserId,
}: {
  community: NonNullable<Awaited<ReturnType<typeof getCommunity.execute>>>;
  currentUserId: User["id"] | undefined;
}) {
  const router = useRouter();
  const aboutRef = useRef<HTMLTextAreaElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [edit, setEdit] = useState(false);

  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const setAboutCommunity = trpc.setAboutCommunity.useMutation({
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMutating = isPending || setAboutCommunity.isLoading;

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-zinc-500">
        <h1 className="font-bold tracking-wide">About Community</h1>
        {community.moderatorId === currentUserId && (
          <div
            ref={dropdownRef}
            className="relative cursor-pointer"
            onClick={toggleDropdown}
          >
            <EllipsisHorizontalIcon className="h-7 w-7 rounded hover:bg-zinc-700/50" />

            {isOpen && (
              <CommunityOptions communityId={community.id} setEdit={setEdit} />
            )}
          </div>
        )}
      </div>
      {!edit && community.about && (
        <p
          className={cn("max-w-[302px] break-words", {
            "animate-pulse": isMutating,
          })}
        >
          {community.about}
        </p>
      )}
      {edit && (
        <>
          <textarea
            ref={aboutRef}
            defaultValue={community.about}
            rows={8}
            className="min-w-0 rounded bg-zinc-400/10 px-2 py-1 outline-none ring-1 ring-inset ring-zinc-700 hover:bg-inherit hover:ring-zinc-300 focus:bg-inherit focus:ring-zinc-300"
            spellCheck={false}
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              className="text-rose-500 hover:opacity-80"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
            <button
              className="hover:opacity-80"
              onClick={() => {
                setAboutCommunity.mutate({
                  id: community.id,
                  about: aboutRef.current?.value ?? "",
                });
                setEdit(false);
              }}
            >
              Save
            </button>
          </div>
        </>
      )}

      <div className="flex items-center gap-2">
        <CakeIcon className="h-6 w-6" />
        <p className="text-zinc-500">
          Created{" "}
          {community.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
