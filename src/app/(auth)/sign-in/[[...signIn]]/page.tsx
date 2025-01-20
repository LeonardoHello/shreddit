import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="grid grow place-content-center p-4">
      <SignIn />
    </div>
  );
}
