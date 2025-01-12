import Image from "next/image";

import { Community } from "@/db/schema";
import { cn } from "@/utils/cn";

export default function CommunityImage({
  icon,
  size,
  className = "",
}: {
  icon?: Community["icon"];
  size: number;
  className?: string;
}) {
  if (icon) {
    return (
      <Image
        src={icon}
        alt="community image"
        width={size}
        height={size}
        className={cn("select-none rounded-full", className)}
        style={{ minWidth: size }}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width={size}
      height={size}
      icon-name="community-fill"
      viewBox="0 0 20 20"
      className={cn("select-none rounded-full", className)}
    >
      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path>
    </svg>
  );
}
