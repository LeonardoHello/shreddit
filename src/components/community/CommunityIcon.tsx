import Image from "next/image";

import * as thumbhash from "thumbhash";

import { Community } from "@/db/schema/communities";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";

export default function CommunityIcon({
  icon,
  iconPlaceholder,
  communtiyName,
  size,
  className,
}: {
  icon: Community["icon"];
  iconPlaceholder: Community["iconPlaceholder"];
  communtiyName: Community["name"];
  size: number | `${number}` | undefined;
  className?: string;
}) {
  const placeholderURL =
    iconPlaceholder &&
    thumbhash.thumbHashToDataURL(Buffer.from(iconPlaceholder, "base64"));

  return (
    <Image
      src={icon ?? defaultCommunityIcon}
      alt={`${communtiyName} community icon`}
      className={className}
      width={size}
      height={size}
      placeholder="blur"
      blurDataURL={icon && placeholderURL ? placeholderURL : undefined}
    />
  );
}
