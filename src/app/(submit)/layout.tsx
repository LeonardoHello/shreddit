import SubmitContextProvider from "@/context/SubmitContext";

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubmitContextProvider>{children}</SubmitContextProvider>;
}
