import Avatar from "react-avatar";
import { useNavigate, useOutletContext } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import {
  formatDate,
  getNotificationUrl,
  NOTIFICATION_TEXT,
} from "../utils/helper";
import { IUseNotification } from "../hooks/useNotification";

export default function NotificationPage() {
  const navigate = useNavigate();
  const { notification, read } = useOutletContext<IUseNotification>();

  const handleOpen = (el: INotification) => {
    read(el.id);
    void navigate(getNotificationUrl(el));
  };

  return (
    <div className="space-y-2">
      <div className="card-title">
        <h2>Notifications</h2>
      </div>

      <section className="space-y-3">
        {notification.map((el) => (
          <div
            onClick={() => handleOpen(el)}
            key={el.id}
            className={twMerge(
              "hover:bg-base-100 bprder flex cursor-pointer items-center justify-between",
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
              <i>{formatDate(el.date)}</i>
              <p>{NOTIFICATION_TEXT[el.type]}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
