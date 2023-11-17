import Link from "next/link";

import Sort from "@/components/Sort";
import SubmitInput from "@/components/SubmitInput";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex grow flex-col items-center gap-2">
      <div className="flex flex-col gap-4">
        <SubmitInput />
        <Sort path="/" />
        {children}
      </div>
      <div>
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
