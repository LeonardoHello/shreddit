import type { RouterInput, RouterOutput } from "@/trpc/routers/_app";

export type ArrElement<Arr> = Arr extends readonly (infer T)[] ? T : never;

export type InfiniteQueryPostProcedure =
  keyof RouterOutput["infiniteQueryPosts"];

export type QueryInfo<T extends InfiniteQueryPostProcedure> = {
  procedure: T;
  input: RouterInput["infiniteQueryPosts"][T];
};

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
