import { useTransition } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import type { getFavoriteCommunities } from "@/lib/api/communities";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";

type ArrElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Props = {
  communityRelations: Awaited<ReturnType<typeof getFavoriteCommunities>>;
  title: string;
  children?: React.ReactNode;
};

export default function MenuNavigationList({
  communityRelations,
  title,
  children,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleFavorite = trpc.favoriteCommunity.useMutation({
    onError: ({ message }) => {
      toast.error(message);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const alphabeticalSorting = (
    a: ArrElement<Props["communityRelations"]>,
    b: ArrElement<Props["communityRelations"]>,
  ) => (a.community.name < b.community.name ? -1 : 1);

  const isMutating = isPending || toggleFavorite.isLoading;

  toggleFavorite.data;

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="px-6 text-2xs text-zinc-300/60 uppercase">{title}</h2>
      <menu className="w-full self-center">
        {communityRelations
          .sort(alphabeticalSorting)
          .map((communityRelation) => (
            <li key={communityRelation.communityId}>
              <Link
                href={`/r/${communityRelation.community.name}`}
                className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
              >
                {communityRelation.community.imageUrl ? (
                  <Image
                    src={communityRelation.community.imageUrl}
                    alt="community image"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#0079D3"
                    className="h-5 w-5 rounded-full border border-zinc-300 bg-zinc-300"
                  >
                    <path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z" />
                  </svg>
                )}

                <h2>r/{communityRelation.community.name}</h2>

                <StarIcon
                  className={cn("ml-auto h-6 w-6", {
                    "fill-[#0079d3] text-[#0079d3]": communityRelation.favorite,
                    "text-zinc-500": communityRelation.favorite === false,
                    "opacity-60": isMutating,
                  })}
                  onClick={(e) => {
                    e.preventDefault();

                    if (isMutating) return;

                    toggleFavorite.mutate({
                      userId: communityRelation.userId,
                      communityId: communityRelation.communityId,
                      favorite: !communityRelation.favorite,
                    });
                  }}
                />
              </Link>
            </li>
          ))}
        {children}
      </menu>
    </div>
  );
}
