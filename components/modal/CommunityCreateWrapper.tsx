"use client";

import { useSearchParams } from "next/navigation";

export default function CommunityCreateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  if (searchParams.get("submit") !== "community") {
    return null;
  }

  return children;
}
