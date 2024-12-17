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
import { FilterPosts, SortPosts } from "../types";

export default async function getUserPosts({
  userId,
  userName,
  cursor,
  filter,
  sort,
}: {
  userId: User["id"];
  userName: User["name"];
  cursor?: number | null | undefined;
  filter?: string | string[] | undefined;
  sort?: string | string[] | undefined;
}) {
  switch (filter) {
    case FilterPosts.SAVED:
      switch (sort) {
        case SortPosts.HOT:
          return getSavedHotPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.NEW:
          return getSavedNewPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.CONTROVERSIAL:
          return getSavedControversialPosts.execute({
            offset: cursor,
            userId,
          });

        default:
          return getSavedBestPosts.execute({
            offset: cursor,
            userId,
          });
      }

    case FilterPosts.HIDDEN:
      switch (sort) {
        case SortPosts.HOT:
          return getHiddenHotPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.NEW:
          return getHiddenNewPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.CONTROVERSIAL:
          return getHiddenControversialPosts.execute({
            offset: cursor,
            userId,
          });

        default:
          return getHiddenBestPosts.execute({
            offset: cursor,
            userId,
          });
      }

    case FilterPosts.UPVOTED:
      switch (sort) {
        case SortPosts.HOT:
          return getUpvotedHotPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.NEW:
          return getUpvotedNewPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.CONTROVERSIAL:
          return getUpvotedControversialPosts.execute({
            offset: cursor,
            userId,
          });

        default:
          return getUpvotedBestPosts.execute({
            offset: cursor,
            userId,
          });
      }

    case FilterPosts.DOWNVOTED:
      switch (sort) {
        case SortPosts.HOT:
          return getDownvotedHotPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.NEW:
          return getDownvotedNewPosts.execute({
            offset: cursor,
            userId,
          });

        case SortPosts.CONTROVERSIAL:
          return getDownvotedControversialPosts.execute({
            offset: cursor,
            userId,
          });

        default:
          return getDownvotedBestPosts.execute({
            offset: cursor,
            userId,
          });
      }

    default:
      switch (sort) {
        case SortPosts.HOT:
          return getUserHotPosts.execute({
            offset: cursor,
            userName,
          });

        case SortPosts.NEW:
          return getUserNewPosts.execute({
            offset: cursor,
            userName,
          });

        case SortPosts.CONTROVERSIAL:
          return getUserControversialPosts.execute({
            offset: cursor,
            userName,
          });

        default:
          return getUserBestPosts.execute({
            offset: cursor,
            userName,
          });
      }
  }
}
