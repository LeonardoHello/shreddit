import { NextResponse } from "next/server";

import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/u/:userName",
    "/r/:communityName",
    "/r/:communityName/comments/:postId",
    "/api/webhooks/(.*)",
    "/api/uploadthing",
  ],
  afterAuth: (auth, req) => {
    if (!auth.userId) {
      if (!auth.isPublicRoute) {
        if (req.nextUrl.pathname === "/home") {
          const unauthenticatedHomePage = new URL("/", req.nextUrl.origin);
          return NextResponse.redirect(unauthenticatedHomePage, {
            status: 301,
          });
        } else if (req.nextUrl.pathname.endsWith("/submit")) {
          return redirectToSignIn({ returnBackUrl: req.url });
        }
      } else if (req.nextUrl.searchParams.get("submit") === "community") {
        return redirectToSignIn({ returnBackUrl: req.url });
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
