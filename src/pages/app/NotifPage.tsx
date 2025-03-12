import { twMerge } from "tailwind-merge";
import { useNotif } from "../../context/NotifContext";
import { NOTIFICATION_TEXT } from "../../utils/constants";
import {
  formatDate,
  getNotifContent,
  getNotificationUrl,
} from "../../utils/helpers";
import UserAvatar from "../../components/user/UserAvatar";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import LoadingOrEmptyCard from "../../components/common/LoadingOrEmptyCard";

function NotifPage() {
  const { notification, read, readAll, clear, loading } = useNotif();

  return (
    <div className="space-y-2">
      <div className="card-title px-3 py-1">
        <p>Notifications</p>

        <div className="ms-auto space-x-2">
          <button
            onClick={() => clear()}
            className="btn btn-outline btn-error btn-sm"
          >
            Clear
          </button>
          <button onClick={readAll} className="btn btn-primary btn-sm">
            Mark all as read
          </button>
        </div>
      </div>

      {!notification.length && <LoadingOrEmptyCard isLoading={loading} />}

      {notification.map((el) => (
        <NotifCard notif={el} key={el.id} onClick={() => read(el.id)} />
      ))}
    </div>
  );
}

export default NotifPage;

interface CardProps extends React.HtmlHTMLAttributes<HTMLAnchorElement> {
  notif: INotification;
}

function NotifCard({ notif, ...props }: CardProps) {
  const content = getNotifContent(notif);
  const cleanContent = DOMPurify.sanitize(content);

  return (
    <Link
      to={getNotificationUrl(notif)}
      className={twMerge(
        "card border-base-content/10 hover:bg-hilit w-full cursor-pointer border p-2 shadow-md transition-colors",
        notif.isRead && "opacity-50",
      )}
      {...props}
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <UserAvatar user={notif.actor} />
        <div className="flex grow space-y-1">
          <div>
            <p>
              <b className="pe-1 font-semibold">{notif.actor.name}</b>
              {NOTIFICATION_TEXT[notif.type]}
            </p>
            {content && (
              <div className="truncate text-sm italic">
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanContent,
                  }}
                />
              </div>
            )}
          </div>
          <p className="ms-auto text-start text-xs opacity-60">
            {formatDate(notif.date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
