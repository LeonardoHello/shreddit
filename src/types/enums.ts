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
  TEXT = "text",
  IMAGE = "image",
}

export enum PostFeed {
  ALL = "all",
  HOME = "home",
  USER = "user",
  COMMUNITY = "community",
  UPVOTED = "upvoted",
  DOWNVOTED = "downvoted",
  SAVED = "saved",
  HIDDEN = "hidden",
}

export enum VoteStatusDelta {
  UPVOTED = 1,
  DOWNVOTED = -1,
  NONE = 0,
}
