export const runtime = "edge";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid grow justify-center p-4 pt-12">{children}</div>;
}
