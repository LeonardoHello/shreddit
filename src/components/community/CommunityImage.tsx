import Image from "next/image";

import { Community } from "@/db/schema";
import cn from "@/utils/cn";

export default function CommunityImage({
  imageUrl,
  size,
  className = "",
}: {
  imageUrl?: Community["imageUrl"];
  size: number;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
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
      viewBox="0 0 20 20"
      fill="#0079D3"
      width={size}
      height={size}
      className={cn(
        "select-none rounded-full border border-zinc-300 bg-zinc-300",
        className,
      )}
      style={{ minWidth: size }}
    >
      <path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z" />
    </svg>
  );
}
