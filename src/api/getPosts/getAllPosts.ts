import db from "@/db";
import { PostSort } from "@/types";
import { monthAgo } from "@/utils/getLastMonthDate";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getAllBestPosts = db.query.posts
  .findMany({ ...postQueryConfig() })
  .prepare("get_all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.HOT),
    where: (post, { gt }) => gt(post.createdAt, monthAgo),
  })
  .prepare("get_all_hot_posts");

export const getAllNewPosts = db.query.posts
  .findMany({ ...postQueryConfig(PostSort.NEW) })
  .prepare("get_all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany({ ...postQueryConfig(PostSort.CONTROVERSIAL) })
  .prepare("get_all_controversial_posts");
