import { Suspense } from "react";

import { currentUser } from "@clerk/nextjs/server";

import { getComments } from "@/api/getComment";
import { getPostById } from "@/api/getPost";
import Comments from "@/components/comment/Comments";
import PostPageComponent from "@/components/post/PostPage";

export default async function PostPage(props: {
  params: Promise<{ postId: string }>;
}) {
  const paramsPromise = props.params;

  const userPromise = currentUser();

  const [params, user] = await Promise.all([paramsPromise, userPromise]).catch(
    (err) => {
      throw new Error(err);
    },
  );

  const postPromise = getPostById.execute({ postId: params.postId });
  const comments = await getComments.execute({ postId: params.postId });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PostPageComponent
        postPromise={postPromise}
        userId={user && user.id}
        username={user && user.username}
      >
        <Comments
          comments={comments.filter((comment) => !comment.parentCommentId)}
          replies={comments.filter((comment) => comment.parentCommentId)}
        />
      </PostPageComponent>
    </Suspense>
  );
}
