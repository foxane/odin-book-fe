import { format, formatDistanceToNow } from "date-fns";
import JOKES from "../assets/jokes.json";

export const addPTag = (s: string) =>
  s
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");

export const removePTag = (s: string) =>
  s.replace(/<p>/g, "").replace(/<\/p>/g, "\n");

export const formatDate = (t: Date | string): string => {
  const time = new Date(t);
  const now = new Date();
  const diffInDays =
    (now.getTime() - new Date(time).getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays < 7)
    return formatDistanceToNow(time, {
      addSuffix: true,
    });
  else return format(time, "d MMMM yyyy");
};

export const getTime = (t: Date | string) =>
  new Date(t).getHours().toString() +
  " : " +
  new Date().getMinutes().toString();

export const getJoke = () =>
  JOKES[Math.floor(Math.random() * JOKES.length) + 1];

/**
 * =========== Notification ============
 */

export const NOTIFICATION_TEXT = {
  follower: "started following you",
  post_from_followed: "created a new post",
  post_liked: "liked your post",
  post_commented: "commented on your post",
  comment_liked: "liked tour comment",
};

export const getNotificationUrl = (notification: INotification) => {
  const { type, actorId, postId } = notification;

  switch (type) {
    case "follower":
      return `/user/${actorId}`;
    case "post_from_followed":
    case "post_liked":
    case "post_commented":
    case "comment_liked":
      return postId ? `/post/${postId.toString()}` : "/post_not_found";

    default:
      return "/notif_type_not_found";
  }
};

export const convertToSummary = (c: Chat, userId: number): ChatSummary => ({
  id: c.id,
  lastMessage: c.message.at(-1) ?? null,
  otherUser: c.member.find((u) => u.id !== userId)!,
  unreadCount: c.message.reduce(
    (acc, el) =>
      el.status === "UNREAD" && el.userId !== userId ? acc + 1 : acc,
    0,
  ),
});

/**
 * Default backend api config
 */
export const API_CONFIG = {
  /**
   * Default cursor based query take limit
   */
  queryLimit: 10,
};
