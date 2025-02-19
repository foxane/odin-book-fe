import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { getNotificationUrl, NOTIFICATION_TEXT } from "../utils/helper";
import useNotification from "../hooks/useNotification";
import { RotateCwIcon } from "lucide-react";

export default function NotificationPage() {
  const { data, query, markAsRead, refresh, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <div className="card-title">
        <h2>Notifications</h2>

        <button
          className="btn btn-square btn-soft ms-auto"
          onClick={refresh}
          disabled={query.isFetching}
        >
          <RotateCwIcon
            className={twMerge(query.isFetching && "animate-spin")}
          />
        </button>
        <button onClick={() => markAllAsRead()} className="btn btn-soft">
          Mark all as read
        </button>
      </div>

      <section>
        {data.map((el) => (
          <div
            onClick={async () => {
              markAsRead(el.id);
              await navigate(getNotificationUrl(el));
            }}
            key={el.id}
            className={twMerge(
              "hover:bg-base-100 flex cursor-pointer items-center justify-between",
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
          </div>
        ))}
      </section>
    </div>
  );
}
