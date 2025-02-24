import Avatar from "react-avatar";
import Card from "../../components/Card";
import useAuth from "../../context/AuthContext";

function MessageCard({ chat }: { chat: Chat }) {
  const { user } = useAuth();
  const otherUser = chat.member.find((el) => el.id !== user?.id);

  return (
    <Card>
      <div className="grid grid-cols-[50px_1fr_auto] items-center gap-x-2">
        <Avatar
          name={otherUser?.name}
          src={otherUser?.avatar ?? ""}
          round
          className="avatar avatar-online row-span-2"
          size="40"
        />

        <div className="truncate">
          <p className="font-bold">{otherUser?.name}</p>
          <p className="truncate text-sm">
            Last messages dawhdu awudh uawd awuhuhuad awiudhdaiuwduh awuhd
            awuduh awiuhdhawaiowf uhpg8huiwegh pwrg [90uqefhohf oihewf ugh
          </p>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <p>2 day ago </p>
          <p className="badge badge-primary ms-auto">10</p>
        </div>
      </div>
    </Card>
  );
}

export default MessageCard;
