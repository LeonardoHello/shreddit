import * as userPosts from "@/lib/api/getPosts";

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
  filter?: string | undefined;
  sort?: string | undefined;
}) {
  let posts;

  switch (filter) {
    case UserPostsFilter.SAVED:
      switch (sort) {
        case SortPosts.HOT:
          posts = await userPosts.getSavedHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await userPosts.getSavedNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await userPosts.getSavedControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await userPosts.getSavedBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    case UserPostsFilter.HIDDEN:
      switch (sort) {
        case SortPosts.HOT:
          posts = await userPosts.getHiddenHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await userPosts.getHiddenNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await userPosts.getHiddenControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await userPosts.getHiddenBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    case UserPostsFilter.UPVOTED:
      switch (sort) {
        case SortPosts.HOT:
          posts = await userPosts.getUpvotedHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await userPosts.getUpvotedNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await userPosts.getUpvotedControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await userPosts.getUpvotedBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    case UserPostsFilter.DOWNVOTED:
      switch (sort) {
        case SortPosts.HOT:
          posts = await userPosts.getDownvotedHotPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.NEW:
          posts = await userPosts.getDownvotedNewPosts.execute({
            offset: 0,
            userId,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await userPosts.getDownvotedControversialPosts.execute({
            offset: 0,
            userId,
          });
          break;

        default:
          posts = await userPosts.getDownvotedBestPosts.execute({
            offset: 0,
            userId,
          });
          break;
      }
      break;

    default:
      switch (sort) {
        case SortPosts.HOT:
          posts = await userPosts.getUserHotPosts.execute({
            offset: 0,
            userName,
          });
          break;

        case SortPosts.NEW:
          posts = await userPosts.getUserNewPosts.execute({
            offset: 0,
            userName,
          });
          break;

        case SortPosts.CONTROVERSIAL:
          posts = await userPosts.getUserControversialPosts.execute({
            offset: 0,
            userName,
          });
          break;

        default:
          posts = await userPosts.getUserBestPosts.execute({
            offset: 0,
            userName,
          });
          break;
      }
      break;
  }

  return posts;
}
