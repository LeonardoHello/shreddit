"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { CakeIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { getCommunityByName } from "@/api/getCommunity";
import { User } from "@/db/schema";
import useDropdown from "@/hooks/useDropdown";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import CommunityImage from "./CommunityImage";
import CommunityOptions from "./CommunityOptions";

export default function CommunityAbout({
  community,
  currentUserId,
}: {
  community: NonNullable<
    Awaited<ReturnType<typeof getCommunityByName.execute>>
  >;
  currentUserId: User["id"] | null;
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
      setEdit(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMutating = isPending || setAboutCommunity.isPending;

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
      <div className="flex items-center gap-1.5">
        <CommunityImage
          imageUrl={community.imageUrl}
          size={48}
          className={cn({ "border-2": !community.imageUrl })}
        />

        <h2 className="truncate text-base font-medium tracking-wide">
          r/{community.name}
        </h2>
      </div>
      {!edit && community.about && (
        <p className="max-w-[302px] break-words">{community.about}</p>
      )}
      {edit && (
        <>
          <textarea
            ref={aboutRef}
            defaultValue={community.about}
            rows={6}
            className="min-w-0 rounded bg-zinc-400/10 px-2 py-1 outline-none ring-1 ring-inset ring-zinc-700 hover:bg-inherit hover:ring-zinc-300 focus:bg-inherit focus:ring-zinc-300"
            spellCheck={false}
            readOnly={isMutating}
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              className="capitalize text-rose-500 transition-opacity hover:opacity-80"
              onClick={() => setEdit(false)}
            >
              cancel
            </button>
            <button
              className="capitalize transition-opacity hover:opacity-80"
              disabled={isMutating}
              onClick={() => {
                if (isMutating) return;

                setAboutCommunity.mutate({
                  id: community.id,
                  about: aboutRef.current?.value ?? "",
                });
              }}
            >
              {isMutating ? "editing..." : "save"}
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
