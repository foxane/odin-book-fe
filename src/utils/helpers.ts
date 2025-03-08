import { format, formatDistanceToNow } from "date-fns";

export const DEFAULT_API_CURSOR_LIMIT = 10;

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

export const postStatusText = {
  create: "Posting...",
  update: "Updating...",
  delete: "Deleting...",
};
