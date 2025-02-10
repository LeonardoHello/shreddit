import db from "@/db";
import { PostSort } from "@/types/enums";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const allPosts = (postSort: PostSort) =>
  postsQueryConfig({
    postSort,
    hideHiddenPosts: true,
    hideMutedCommunityPosts: true,
  });

export const getAllBestPosts = db.query.posts
  .findMany(allPosts(PostSort.BEST))
  .prepare("all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany(allPosts(PostSort.HOT))
  .prepare("all_hot_posts");

export const getAllNewPosts = db.query.posts
  .findMany(allPosts(PostSort.NEW))
  .prepare("all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany(allPosts(PostSort.CONTROVERSIAL))
  .prepare("all_controversial_posts");
