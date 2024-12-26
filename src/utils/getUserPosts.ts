import {
  getDownvotedBestPosts,
  getDownvotedControversialPosts,
  getDownvotedHotPosts,
  getDownvotedNewPosts,
} from "../api/getPosts/getDownvotedPosts";
import {
  getHiddenBestPosts,
  getHiddenControversialPosts,
  getHiddenHotPosts,
  getHiddenNewPosts,
} from "../api/getPosts/getHiddenPosts";
import {
  getSavedBestPosts,
  getSavedControversialPosts,
  getSavedHotPosts,
  getSavedNewPosts,
} from "../api/getPosts/getSavedPosts";
import {
  getUpvotedBestPosts,
  getUpvotedControversialPosts,
  getUpvotedHotPosts,
  getUpvotedNewPosts,
} from "../api/getPosts/getUpvotedPosts";
import {
  getUserBestPosts,
  getUserControversialPosts,
  getUserHotPosts,
  getUserNewPosts,
} from "../api/getPosts/getUserPosts";
import { User } from "../db/schema";
import { PostFilter, PostSort } from "../types";

export default async function getUserPosts({
  currentUserId,
  userId,
  username,
  cursor,
  filter,
  sort,
}: {
  currentUserId: User["id"] | null;
  userId: User["id"];
  username: User["name"];
  cursor?: number | null | undefined;
  filter?: string | string[] | undefined;
  sort?: string | string[] | undefined;
}) {
  switch (filter) {
    case PostFilter.SAVED:
      switch (sort) {
        case PostSort.HOT:
          return getSavedHotPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.NEW:
          return getSavedNewPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.CONTROVERSIAL:
          return getSavedControversialPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        default:
          return getSavedBestPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });
      }

    case PostFilter.HIDDEN:
      switch (sort) {
        case PostSort.HOT:
          return getHiddenHotPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.NEW:
          return getHiddenNewPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.CONTROVERSIAL:
          return getHiddenControversialPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        default:
          return getHiddenBestPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });
      }

    case PostFilter.UPVOTED:
      switch (sort) {
        case PostSort.HOT:
          return getUpvotedHotPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.NEW:
          return getUpvotedNewPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.CONTROVERSIAL:
          return getUpvotedControversialPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        default:
          return getUpvotedBestPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });
      }

    case PostFilter.DOWNVOTED:
      switch (sort) {
        case PostSort.HOT:
          return getDownvotedHotPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.NEW:
          return getDownvotedNewPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        case PostSort.CONTROVERSIAL:
          return getDownvotedControversialPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });

        default:
          return getDownvotedBestPosts.execute({
            currentUserId,
            userId,
            offset: cursor,
          });
      }

    default:
      switch (sort) {
        case PostSort.HOT:
          return getUserHotPosts.execute({
            currentUserId,
            username,
            offset: cursor,
          });

        case PostSort.NEW:
          return getUserNewPosts.execute({
            currentUserId,
            username,
            offset: cursor,
          });

        case PostSort.CONTROVERSIAL:
          return getUserControversialPosts.execute({
            currentUserId,
            username,
            offset: cursor,
          });

        default:
          return getUserBestPosts.execute({
            currentUserId,
            username,
            offset: cursor,
          });
      }
  }
}
