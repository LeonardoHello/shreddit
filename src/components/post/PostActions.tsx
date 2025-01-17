"use client";

import { Link, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { usePostContext } from "@/context/PostContext";
import { Button } from "../ui/button";

export default function PostActions({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = usePostContext();

  const copyLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const origin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    await navigator.clipboard.writeText(
      `${origin}/r/${state.community.name}/comments/${state.id}`,
    );
    toast.success("Link copied!");
  };

  return (
    <div className="flex items-center gap-2">
      {children}

      <Button size="sm" variant={"secondary"} className="rounded-full">
        <MessageCircle className="size-4" />
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(state.commentCount)}
      </Button>

      <Button
        size="sm"
        variant={"secondary"}
        className="rounded-full"
        onClick={copyLink}
      >
        <Link className="size-4" />
        Copy
      </Button>
    </div>
  );
}
