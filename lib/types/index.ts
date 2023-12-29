import { DBQueryConfig, ExtractTablesWithRelations } from "drizzle-orm";

import type { RouterInput, RouterOutput } from "@/trpc/procedures";

import type * as schema from "../db/schema";

export type ArrElement<Arr> = Arr extends readonly (infer T)[] ? T : never;

export type InfiniteQueryPostProcedure =
  keyof RouterOutput["infiniteQueryPosts"];

export type QueryInfo<T extends InfiniteQueryPostProcedure> = {
  procedure: T;
  input: RouterInput["infiniteQueryPosts"][T];
};

export type InfiniteQueryPost = ArrElement<
  RouterOutput["infiniteQueryPosts"][InfiniteQueryPostProcedure]["posts"]
>;

export enum SortPosts {
  BEST = "best",
  HOT = "hot",
  NEW = "new",
  CONTROVERSIAL = "controversial",
}

export enum UserPostsFilter {
  SAVED = "saved",
  HIDDEN = "hidden",
  UPVOTED = "upvoted",
  DOWNVOTED = "downvoted",
}

export type PostsQueryConfig = DBQueryConfig<
  "many",
  true,
  ExtractTablesWithRelations<typeof schema>,
  ExtractTablesWithRelations<typeof schema>["posts"]
>;
