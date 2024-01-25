import { SignIn } from "@clerk/nextjs";

import CommunityCreate from "@/components/community/CommunityCreate";
import Modal from "@/components/shared/Modal";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      {searchParams.submit === "community" && (
        <Modal>
          <CommunityCreate />
        </Modal>
      )}
      <SignIn signUpUrl="sign-up" />;
    </>
  );
}
