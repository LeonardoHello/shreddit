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
import { SortPosts, UserPostsFilter } from "../types";

export default async function getUserPosts({
  userId,
  userName,
  filter,
  sort,
}: {
  userId: User["id"];
  userName: User["name"];
  filter?: string | string[] | undefined;
  sort?: string | string[] | undefined;
}) {
  let posts;

  switch (filter) {
    case UserPostsFilter.SAVED:
      switch (sort) {
        case SortPosts.HOT:
          posts = await getSavedHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await getSavedNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await getSavedControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await getSavedBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    case UserPostsFilter.HIDDEN:
      switch (sort) {
        case SortPosts.HOT:
          posts = await getHiddenHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await getHiddenNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await getHiddenControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await getHiddenBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    case UserPostsFilter.UPVOTED:
      switch (sort) {
        case SortPosts.HOT:
          posts = await getUpvotedHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await getUpvotedNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await getUpvotedControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await getUpvotedBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    case UserPostsFilter.DOWNVOTED:
      switch (sort) {
        case SortPosts.HOT:
          posts = await getDownvotedHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await getDownvotedNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await getDownvotedControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await getDownvotedBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    default:
      switch (sort) {
        case SortPosts.HOT:
          posts = await getUserHotPosts.execute({
            offset: 0,
            userName,
          });
          break;

        case SortPosts.NEW:
          posts = await getUserNewPosts.execute({
            offset: 0,
            userName,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await getUserControversialPosts.execute({
            offset: 0,
            userName,
          });
          break;

        default:
          posts = await getUserBestPosts.execute({
            offset: 0,
            userName,
          });
          break;
      }
      break;
  }

  return posts;
}
