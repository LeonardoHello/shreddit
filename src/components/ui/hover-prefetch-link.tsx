"use client";

import { PropsWithChildren, useState } from "react";
import Link, { LinkProps } from "next/link";

export function HoverPrefetchLink(
  props: PropsWithChildren<
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
      LinkProps &
      React.RefAttributes<HTMLAnchorElement>
  >,
) {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {props.children}
    </Link>
  );
}
