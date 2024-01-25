import { SignUp } from "@clerk/nextjs";

import CommunityCreate from "@/components/community/CommunityCreate";
import Modal from "@/components/shared/Modal";

export default function SignUpPage({
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
      <SignUp signInUrl="/sign-in" />;
    </>
  );
}
