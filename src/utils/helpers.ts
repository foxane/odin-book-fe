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
