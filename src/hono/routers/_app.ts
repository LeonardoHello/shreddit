import { Hono } from "hono";

import { comment } from "./comment";
import { community } from "./community";
import { post } from "./post";
import { user } from "./user";
import { userToComment } from "./userToComment";
import { userToCommunity } from "./userToCommunity";
import { userToPost } from "./userToPost";

export const app = new Hono()
  .basePath("/api")
  .route("/users", user)
  .route("/users/me/communities", userToCommunity)
  .route("/users/me/posts", userToPost)
  .route("/users/me/comments", userToComment)
  .route("/communities", community)
  .route("/posts", post)
  .route("/comments", comment);

export type AppType = typeof app;
