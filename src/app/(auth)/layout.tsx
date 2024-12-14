export const runtime = "edge";
export const preferredRegion = ["fra1"];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid grow justify-center p-4 pt-12">{children}</div>;
}
