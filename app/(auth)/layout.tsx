export const runtime = "edge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen place-content-center bg-zinc-950 p-12">
      {children}
    </div>
  );
}
