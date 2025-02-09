"use client";

import Link from "next/link";

import { TRPCClientError } from "@trpc/client";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppRouter } from "@/trpc/routers/_app";

function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (isTRPCClientError(error)) {
    const { message, data } = error;

    return (
      <main className="grid grow place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">
            {data ? data.httpStatus : "4xx"}
          </Badge>

          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {data ? data.code.replaceAll("_", " ") : "CLIENT ERROR"}
          </h1>

          <p className="mt-6 font-semibold leading-7 text-muted-foreground sm:text-lg">
            {message}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Button onClick={reset}>Try again</Button>
            <Button variant="link" asChild className="group">
              <Link href="/">
                Go back home{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid grow place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Badge variant="secondary" className="mb-2">
          5xx
        </Badge>

        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          INTERNAL SERVER ERROR
        </h1>

        <p className="mt-6 font-semibold leading-7 text-muted-foreground sm:text-lg">
          An unexpected error occurred while processing your request. Please try
          again later.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Button onClick={reset}>Try again</Button>
          <Button variant="link" asChild className="group">
            <Link href="/">
              Go back home{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
