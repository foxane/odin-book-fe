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
