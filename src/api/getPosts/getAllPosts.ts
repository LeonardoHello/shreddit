import db from "@/db";
import { PostSort } from "@/types";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const bestAllPosts = postsQueryConfig({
  hideMuted: true,
});
const hotAllPosts = postsQueryConfig({
  sort: PostSort.HOT,
  hideMuted: true,
});
const newAllPosts = postsQueryConfig({
  sort: PostSort.NEW,
  hideMuted: true,
});
const controversialAllPosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
  hideMuted: true,
});

export const getAllBestPosts = db.query.posts
  .findMany({ ...bestAllPosts })
  .prepare("all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany({ ...hotAllPosts })
  .prepare("all_hot_posts");

export const getAllNewPosts = db.query.posts
  .findMany({ ...newAllPosts })
  .prepare("all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany({ ...controversialAllPosts })
  .prepare("all_controversial_posts");
