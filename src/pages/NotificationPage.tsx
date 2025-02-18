import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../utils/services";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

const notifText = {
  follower: "started to follow you",
  post_from_followed: "created new post",
  post_liked: "liked your post",
  post_commented: "commented on your post",
  comment_liked: "liked tour comment",
};

const getLink = (
  type: NotifType,
  actorId: string,
  resourceId?: number | null,
) => {
  let url = "";
  switch (type) {
    case "follower":
      url = `/user/${actorId}`;
      break;
    case "post_from_followed":
    case "post_liked":
    case "post_commented":
    case "comment_liked":
      url = resourceId ? `/post/${resourceId.toString()}` : "post_not_found";
      break;

    default:
      url = "/notif_type_not_found";
      break;
  }

  return url;
};

const getNotif = async (cursor = "", take = "") => {
  const { data } = await api.axios.get<INotification[]>(
    `/notifications?cursor=${cursor}&take=${take}`,
  );
  return data;
};

export default function NotificationPage() {
  const query = useInfiniteQuery({
    queryKey: ["notifications"],
    initialPageParam: "",
    queryFn: ({ pageParam }) => getNotif(pageParam),
    getNextPageParam: (prevPage) => {
      if (prevPage.length < 10) return undefined;
      else return prevPage.at(-1)?.id.toString();
    },
  });

  const notifications = query.data?.pages.flat() ?? [];

  if (query.isLoading) return <div className="loading"></div>;
  return (
    <div>
      {notifications.map((el) => (
        <div
          key={el.id}
          className={twMerge(
            "flex items-center justify-between",
            el.isRead && "opacity-50",
          )}
        >
          <p>
            <Avatar
              name={el.actor.name}
              src={el.actor.avatar ?? ""}
              size="40"
              round
            />
            <b>{el.actor.name} </b>
            {notifText[el.type]}
          </p>

          <Link
            className="btn btn-primary btn-sm"
            to={getLink(el.type, el.actorId, el.postId)}
          >
            <ArrowRight />
          </Link>
        </div>
      ))}
    </div>
  );
}
