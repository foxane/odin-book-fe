import Avatar from "react-avatar";
import { twMerge } from "tailwind-merge";
import { formatDate, NOTIFICATION_TEXT } from "../utils/helper";
import Card from "./Card";

interface Props {
  notif: INotification;
  handleClick: (id: INotification) => void;
}

function NotificationCard({ notif, handleClick }: Props) {
  return (
    <Card
      onClick={() => handleClick(notif)}
      className={twMerge(notif.isRead && "opacity-50")}
    >
      <div className="flex w-full flex-wrap items-center gap-1 text-sm">
        <Avatar
          name={notif.actor.name}
          src={notif.actor.avatar ?? ""}
          size="35"
          round
        />
        <div className="space-y-1">
          <p>
            <b className="pe-1 font-semibold">{notif.actor.name}</b>
            {NOTIFICATION_TEXT[notif.type]}
          </p>
          <p className="text-start text-xs opacity-60">
            {formatDate(notif.date)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default NotificationCard;
