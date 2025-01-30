"use client";

import Link from "next/link";

import { trpc } from "@/trpc/client";
import { PostSort } from "@/types";

export default function Logo() {
  const utils = trpc.useUtils();

  const prefetchAll = () => {
    const allPosts = utils.postFeed.getAllPosts;

    if (!allPosts.getInfiniteData({ sort: PostSort.BEST })) {
      utils.postFeed.getAllPosts.prefetchInfinite({ sort: PostSort.BEST });
    }
  };

  return (
    <Link
      href="/"
      className="flex items-center gap-1.5"
      onTouchStart={prefetchAll}
      onMouseEnter={prefetchAll}
    >
      <LogoIcon className="size-8" />
      <LogoText className="hidden h-6 w-auto md:block" />
    </Link>
  );
}

function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="96.000000pt"
      height="96.000000pt"
      viewBox="0 0 96.000000 96.000000"
      preserveAspectRatio="xMidYMid meet"
      fill="#fff"
    >
      <circle cx="48" cy="41.8" r="33.2" fill="#fff" />
      <g
        transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)"
        fill="#f43f5e"
        stroke="none"
      >
        <path
          d="M415 954 c-119 -18 -243 -92 -315 -188 -178 -236 -94 -585 172 -711
 388 -184 797 187 654 593 -44 123 -163 240 -288 281 -65 21 -170 33 -223 25z
 m169 -238 c20 -15 46 -45 57 -68 l21 -41 42 42 c48 47 73 52 82 16 8 -34 -1
 -55 -26 -55 -12 0 -34 -7 -50 -15 l-28 -15 5 -99 c6 -94 4 -103 -21 -154 -17
 -36 -40 -64 -68 -83 -37 -26 -50 -29 -118 -29 -68 0 -81 3 -118 29 -27 19 -51
 47 -68 82 -24 50 -26 62 -23 157 l4 102 -50 16 c-53 18 -60 27 -51 64 9 36 34
 31 82 -16 l42 -42 20 39 c38 75 93 107 174 101 42 -2 65 -10 92 -31z"
        />
        <path
          d="M375 600 c-10 -11 -13 -20 -7 -20 7 0 12 5 12 10 0 6 9 10 20 10 11
 0 20 -5 20 -12 0 -6 3 -8 6 -5 7 7 -14 37 -26 37 -4 0 -15 -9 -25 -20z"
        />
        <path
          d="M540 605 c-7 -9 -10 -18 -6 -22 3 -3 6 -1 6 5 0 7 9 12 20 12 11 0
 20 -4 20 -10 0 -5 5 -10 12 -10 6 0 3 9 -7 20 -22 24 -29 25 -45 5z"
        />
        <path
          d="M440 529 c-47 -25 -46 -51 3 -61 54 -11 112 3 112 27 0 13 -8 21 -22
 23 -12 2 -27 10 -33 18 -15 17 -15 17 -60 -7z"
        />
        <path
          d="M395 390 c22 -21 35 -25 85 -25 50 0 63 4 85 25 l25 25 -110 0 -110
 0 25 -25z"
        />
      </g>
    </svg>
  );
}

function LogoText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="672.000000pt"
      height="186.000000pt"
      viewBox="0 0 672.000000 186.000000"
      style={{
        shapeRendering: "geometricPrecision",
        textRendering: "geometricPrecision",
        imageRendering: "-webkit-optimize-contrast",
        fillRule: "evenodd",
        clipRule: "evenodd",
      }}
    >
      <circle cx="578" cy="45" r="15" fill="#f43f5e" />
      <path
        fill="#d4d4d8"
        d="M91 17c6-2 11 0 14 6l2 50c25-13 46-7 62 17a108 108 0 0 1 4 11 961 961 0 0 1 0 62c-4 4-9 6-14 4a18 18 0 0 1-5-5l-1-54c-3-13-11-20-23-21-7 0-12 2-16 6a27 27 0 0 0-7 11 22389 22389 0 0 1-3 60c-4 3-8 4-13 3a15 15 0 0 1-5-4V22a33 33 0 0 1 5-5z"
      />
      <path
        fill="#d4d4d8"
        d="M430 17c5-2 10 0 14 5v106c-7 25-23 38-49 40-27-1-43-15-50-40-4-29 8-49 35-60 16-4 30-1 44 8l1-53a41 41 0 0 1 5-6zm-37 70c18 1 29 11 32 30-3 18-13 28-30 31-18-3-28-13-30-31 1-17 11-27 28-30zm148-70c5-2 10 0 14 5v106c-7 25-23 38-49 40-27-1-43-15-50-40-4-29 8-49 35-60 16-4 30-1 44 8l1-53a41 41 0 0 1 5-6zm-37 70c18 1 29 11 32 30-3 18-13 28-30 31-18-3-28-13-30-31 1-17 11-27 28-30z"
      />
      <path
        fill="#d4d4d8"
        d="M624 17c5-2 10 0 13 5l1 45h19c6 6 6 13 0 19l-19 1-1 76c-4 5-9 6-15 3a12 12 0 0 1-4-4V87l-19-1c-7-6-7-13 0-19h19V23c1-3 3-5 6-6z"
      />
      <path
        fill="#d4d4d8"
        d="M37 67c16-3 28 3 36 18 2 12-3 17-15 13a33 33 0 0 1-6-9c-9-4-15-1-17 8l4 7c4 2 9 3 14 3 17 7 24 20 21 39-9 21-25 27-46 17-9-5-13-13-13-23 4-7 9-8 16-5l8 11c8 3 13 0 16-9l-4-8a122 122 0 0 0-17-4c-16-7-22-19-19-36 3-12 11-19 22-22z"
      />
      <path
        fill="#d4d4d8"
        d="M225 67h15c4 3 6 8 4 14l-5 5c-19 0-30 10-34 28l-1 48c-3 5-8 7-14 5l-5-4a784 784 0 0 1 0-56c5-22 19-35 40-40z"
      />
      <path
        fill="#d4d4d8"
        d="M279 67c25-3 44 6 56 29 3 8 4 17 3 27l-4 4-73 1c8 17 22 23 41 17a35 35 0 0 0 10-5c6-2 11 0 13 7 1 5 0 10-5 13-13 7-27 10-41 7-22-5-35-18-40-39-3-32 10-52 40-61zm8 20c14 0 24 6 30 20a393 393 0 0 1-56 0c5-12 13-19 26-20z"
      />
      <path
        fill="#d4d4d8"
        d="M573 67c6-2 11 0 14 6a1980 1980 0 0 1 0 89c-3 5-8 7-14 5a15 15 0 0 1-5-4 2069 2069 0 0 1 0-91 33 33 0 0 1 5-5z"
      />
    </svg>
  );
}
