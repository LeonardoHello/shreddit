import type { RouterInput, RouterOutput } from "@/trpc/procedures";

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

export enum SortPostsBy {
  BEST = "best",
  HOT = "hot",
  NEW = "new",
  CONTROVERSIAL = "controversial",
}
