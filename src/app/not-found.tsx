"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid grow place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-rose-500">404 Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-200 sm:text-6xl">
          Page Not Found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" className="text-sm font-semibold text-gray-200">
            Go back home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
