import { useNavigate } from "react-router-dom";
import { getNotificationUrl } from "../utils/helper";
import NotificationCard from "../components/NotificationCard";
import { Trash2Icon } from "lucide-react";
import useNotification from "../hooks/useNotification";

export default function NotificationPage() {
  const navigate = useNavigate();
  const { read, clear, readAll, notification } = useNotification();

  const handleOpen = (el: INotification) => {
    read(el.id);
    void navigate(getNotificationUrl(el));
  };

  return (
    <div className="space-y-2">
      <div className="card-title pb-2">
        <button
          data-tip="Delete already read notification"
          onClick={() => clear()}
          className="tooltip tooltip-left btn-sm btn btn-square btn-outline btn-error ms-auto flex items-center"
        >
          <Trash2Icon size={20} />
        </button>
        <button onClick={readAll} className="btn btn-soft btn-sm">
          Mark all as read
        </button>
      </div>

      <section className="space-y-3">
        {notification.map((el) => (
          <NotificationCard notif={el} handleClick={handleOpen} key={el.id} />
        ))}
      </section>
    </div>
  );
}
