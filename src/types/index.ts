export type ArrElement<Arr> = Arr extends readonly (infer T)[] ? T : never;

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
