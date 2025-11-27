import SignInButtons from "@/components/sign-in-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="container flex grow flex-col items-center justify-center gap-4 p-2 pb-6 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in with your favorite social provider
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-4">
          <SignInButtons />
        </CardContent>
      </Card>
    </div>
  );
}
