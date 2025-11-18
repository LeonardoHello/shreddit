import { Hono } from "hono";

import { comment } from "./comment";
import { community } from "./community";
import { feedAll } from "./feedAll";
import { feedCommunity } from "./feedCommunity";
import { feedDownvoted } from "./feedDownvoted";
import { feedHidden } from "./feedHidden";
import { feedHome } from "./feedHome";
import { feedSaved } from "./feedSaved";
import { feedUpvoted } from "./feedUpvoted";
import { feedUser } from "./feedUser";
import { post } from "./post";
import { user } from "./user";
import { userToComment } from "./userToComment";
import { userToCommunity } from "./userToCommunity";
import { userToPost } from "./userToPost";

export const app = new Hono()
  .basePath("/api")
  .route("/users", user)
  .route("/posts", post)
  .route("/posts", userToPost)
  .route("/comments", comment)
  .route("/comments", userToComment)
  .route("/communities", community)
  .route("/communities", userToCommunity)
  .route("/posts", feedAll)
  .route("/posts", feedHome)
  .route("/posts", feedCommunity)
  .route("/posts", feedUser)
  .route("/posts", feedUpvoted)
  .route("/posts", feedDownvoted)
  .route("/posts", feedSaved)
  .route("/posts", feedHidden);

export type AppType = typeof app;
