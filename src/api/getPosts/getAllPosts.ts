import db from "@/db";
import {
  bestPostsQueryConfig,
  controversialPostsQueryConfig,
  hotPostsQueryConfig,
  newPostsQueryConfig,
} from "@/utils/postsQueryConfig";

const hideFilter = {
  hideHidden: true,
  hideCommunityMuted: true,
};

export const getAllBestPosts = db.query.posts
  .findMany(bestPostsQueryConfig(hideFilter))
  .prepare("all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany(hotPostsQueryConfig(hideFilter))
  .prepare("all_hot_posts");

export const getAllNewPosts = db.query.posts
  .findMany(newPostsQueryConfig(hideFilter))
  .prepare("all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany(controversialPostsQueryConfig(hideFilter))
  .prepare("all_controversial_posts");
