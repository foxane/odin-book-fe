export const DEFAULT_API_CURSOR_LIMIT = 10;

export const POST_STATUS_TEXT = Object.freeze({
  create: "Posting...",
  update: "Updating...",
  delete: "Deleting...",
});

export const QUERY_KEY = Object.freeze({
  posts: ["posts"],
});

export type UserPageKeys = Record<
  "userKey" | "postKey" | "followerKey" | "followingKey",
  unknown[]
>;

export const createUserPageKey = (userId: string): UserPageKeys => ({
  userKey: ["user", userId],
  postKey: ["posts", { userId }],
  followerKey: ["follower", { userId }],
  followingKey: ["following", { userId }],
});
