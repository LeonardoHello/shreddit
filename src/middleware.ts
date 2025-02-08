import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { PostSort } from "./types";

const isProtectedRoute = createRouteMatcher(["/home(.*)", "/submit(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  if (req.nextUrl.pathname === "/") {
    if (userId) {
      return NextResponse.rewrite(new URL(`/home/${PostSort.BEST}`, req.url));
    } else {
      return NextResponse.rewrite(new URL(`/all/${PostSort.BEST}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
