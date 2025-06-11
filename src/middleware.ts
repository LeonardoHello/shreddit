import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

import { PostSort } from "./types/enums";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (sessionCookie && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !sessionCookie &&
    (pathname.startsWith("/home") || pathname.startsWith("/submit"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    if (sessionCookie) {
      return NextResponse.rewrite(
        new URL(`/home/${PostSort.BEST}`, request.url),
      );
    } else {
      return NextResponse.rewrite(
        new URL(`/all/${PostSort.BEST}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/submit", "/sign-in"],
};
