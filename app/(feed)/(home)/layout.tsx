import Link from "next/link";

import InputSubmit from "@/components/InputSubmit";
import Sort from "@/components/Sort";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex grow justify-center gap-2 px-6 py-5">
      <div className="flex w-full flex-col gap-4 lg:max-w-2xl">
        <InputSubmit />
        <Sort path="/" />
        {children}
      </div>
      <div className="hidden lg:block">
        <Link
          href="https://utfs.io/f/13f13b19-107c-4ab7-85d9-10f4714529e2-pmcoca.jpg"
          target="_blank"
        >
          Try Now
        </Link>
      </div>
    </main>
  );
}
