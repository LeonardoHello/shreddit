import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="grid grow justify-center p-4">
      <SignUp />
    </div>
  );
}
