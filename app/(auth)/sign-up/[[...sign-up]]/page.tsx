import { SignUp } from "@clerk/nextjs";

import CommunityCreate from "@/components/modal/CommunityCreate";
import Modal from "@/components/modal/Modal";

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
      <SignUp signInUrl="/sign-in" />
    </>
  );
}
