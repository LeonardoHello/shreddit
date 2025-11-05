import Link from "next/link";

import { Plus } from "lucide-react";

import { getSession } from "@/app/actions";
import CommentSection from "@/components/comment/CommentSection";
import Post from "@/components/post/Post";
import RTEComment from "@/components/RTE/RTEComment";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function PostPage(
  props: PageProps<"/r/[communityName]/comments/[postId]">,
) {
  const [params, session] = await Promise.all([props.params, getSession()]);

  return (
    <div className="flex w-0 grow flex-col gap-2">
      <Post
        currentUserId={session && session.session.userId}
        postId={params.postId}
      />

      <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 pb-8">
        {session ? (
          <RTEComment postId={params.postId} />
        ) : (
          <Button
            variant={"outline"}
            className="self-start rounded-full"
            asChild
          >
            <Link href={"/sign-in"}>
              <Plus className="stroke-[1.5]" viewBox="4 4 16 16" />
              Add a comment
            </Link>
          </Button>
        )}

        <Separator />

        <CommentSection
          currentUserId={session && session.session.userId}
          postId={params.postId}
        />
      </div>
    </div>
  );
}
