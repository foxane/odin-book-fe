import { QueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (t: Date | string): string => {
  const time = new Date(t);
  const now = new Date();
  const diffInDays =
    (now.getTime() - new Date(time).getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays < 7)
    return formatDistanceToNow(time, {
      addSuffix: true,
    });
  else return format(time, "dd LLL yyyy 'at' HH:mm");
};

export function modifyLike<T extends Post | IComment>(data: T): T {
  const { _count, isLiked } = data;
  const updatedCount = {
    ..._count,
    likedBy: _count.likedBy + (isLiked ? -1 : +1),
  };

  return { ...data, _count: updatedCount, isLiked: !isLiked };
}

export const cancelAndGetPrev = async <T>(
  client: QueryClient,
  queryKey: unknown[],
) => {
  await client.cancelQueries({ queryKey });
  return client.getQueryData<T>(queryKey);
};

export function isComment(data: Post | IComment): data is IComment {
  return "postId" in data;
}

/**
 * @param user User
 * @param shallow true = only change isFollowed property
 * @returns User
 */
export const modifyFollow = (user: User, shallow = false): User => {
  if (shallow) {
    return { ...user, isFollowed: !user.isFollowed };
  }

  const { _count, isFollowed } = user;
  const updatedCount = {
    ..._count,
    follower: _count.follower + (isFollowed ? -1 : +1),
  };

  return { ...user, _count: updatedCount, isFollowed: !isFollowed };
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

export const getNotifContent = (notif: INotification): string => {
  const { type } = notif;

  switch (type) {
    case "post_from_followed":
    case "post_liked":
      return notif.post?.text ?? "";

    case "post_commented":
    case "comment_liked":
      return notif.comment?.text ?? "";

    case "follower":
      return "";

    default:
      return "";
  }
};
