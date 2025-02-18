import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { getNotificationUrl, NOTIFICATION_TEXT } from "../utils/helper";
import useNotification from "../hooks/useNotification";

export default function NotificationPage() {
  const { data, query } = useNotification();

  if (query.isLoading) return <div className="loading"></div>;
  return (
    <div>
      {data.map((el) => (
        <div
          key={el.id}
          className={twMerge(
            "flex items-center justify-between",
            el.isRead && "opacity-50",
          )}
        >
          <div>
            <Avatar
              name={el.actor.name}
              src={el.actor.avatar ?? ""}
              size="40"
              round
            />
            <b>{el.actor.name} </b>
            {NOTIFICATION_TEXT[el.type]}
          </div>

          <Link className="btn btn-primary btn-sm" to={getNotificationUrl(el)}>
            <ArrowRight />
          </Link>
        </div>
      ))}
    </div>
  );
}
