"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorFilter = (message: string) => {
    const statusCode = message.slice(0, 3);
    if (Number.isInteger(Number(statusCode))) {
      return { statusCode, message: message.slice(4) };
    }

    return { statusCode: "5xx", message: "internal server error" };
  };

  const err = errorFilter(error.message);

  return (
    <div className="grid grow place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Badge variant="secondary" className="mb-2">
          {err.statusCode}
        </Badge>

        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight uppercase sm:text-5xl lg:text-6xl">
          {err.message}
        </h1>

        <p className="text-muted-foreground mt-6 leading-7 font-semibold sm:text-lg">
          An error occurred while processing your request. Please try again
          later.
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
    </div>
  );
}
