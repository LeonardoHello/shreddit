import type { RouterInput, RouterOutput } from "@/trpc/routers/_app";

export type ArrElement<Arr> = Arr extends readonly (infer T)[] ? T : never;

export type PostFeedProcedures = keyof RouterOutput["postFeed"];

export type QueryInfo<T extends PostFeedProcedures> = {
  procedure: T;
  input: RouterInput["postFeed"][T];
};

export enum PostSort {
  BEST = "best",
  HOT = "hot",
  NEW = "new",
  CONTROVERSIAL = "controversial",
}

export enum PostFilter {
  SAVED = "saved",
  HIDDEN = "hidden",
  UPVOTED = "upvoted",
  DOWNVOTED = "downvoted",
}

export enum PostType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}
