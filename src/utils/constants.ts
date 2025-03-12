export const DEFAULT_API_CURSOR_LIMIT = 10;

export const POST_STATUS_TEXT = Object.freeze({
  create: "Posting...",
  update: "Updating...",
  delete: "Deleting...",
});

export const QUERY_KEY = Object.freeze({
  posts: ["posts"],
});

// export type UserPageKeys = Record<
//   "userKey" | "postKey" | "followerKey" | "followingKey",
//   unknown[]
// >;

type Key = [string, { userId: string }];

export interface UserPageKeys
  extends Record<"postKey" | "followerKey" | "followingKey", Key> {
  userKey: ["user", string];
}

export const createUserPageKey = (userId: string): UserPageKeys => ({
  userKey: ["user", userId],
  postKey: ["posts", { userId }],
  followerKey: ["follower", { userId }],
  followingKey: ["following", { userId }],
});

export const NOTIFICATION_TEXT = {
  follower: "started following you",
  post_from_followed: "created a new post",
  post_liked: "liked your post",
  post_commented: "commented on your post",
  comment_liked: "liked tour comment",
};
