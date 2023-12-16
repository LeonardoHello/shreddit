import { NextResponse } from "next/server";

import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/api/webhooks/(.*)",
    "/api/uploadthing",
    "/all",
    "/u/:userName",
    "/r/:communityName",
    "/r/:communityName/post/:postId",
  ],
  beforeAuth: (req) => {
    if (req.nextUrl.pathname.endsWith("/best")) {
      const newPathname = req.nextUrl.pathname.replace("/best", "");
      const url = new URL(newPathname, req.nextUrl.origin);
      return NextResponse.rewrite(url, { status: 301 });
    }
  },
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      if (req.nextUrl.pathname === "/") {
        const unauthenticatedHomePage = new URL("/all", req.nextUrl.origin);
        return NextResponse.redirect(unauthenticatedHomePage, { status: 301 });
      } else if (req.nextUrl.pathname.endsWith("/submit")) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
