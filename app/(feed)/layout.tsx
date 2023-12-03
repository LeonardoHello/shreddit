import Header from "@/components/Header";

export const runtime = "edge";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
    </div>
  );
}
