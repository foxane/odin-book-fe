import Avatar from "react-avatar";
import useAuth from "../context/AuthContext";
import { PlusCircleIcon } from "lucide-react";
import Card from "../components/Card";

function MessagePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between p-2">
        <h1 className="text-xl font-semibold">Messages</h1>
        <button className="btn btn-square btn-primary">
          <PlusCircleIcon />
        </button>
      </div>

      <section className="space-y-3">
        <Card>
          <div className="grid cursor-pointer grid-cols-[50px_1fr_auto] items-center gap-x-2">
            <Avatar
              name={user?.name}
              src={user?.avatar ?? ""}
              round
              className="avatar avatar-online row-span-2"
              size="40"
            />

            <div className="truncate">
              <p className="font-bold">{user?.name}</p>
              <p className="text-sm">
                Last messages dawhdu awudh uawd awuhuhuad awiudhdaiuwduh awuhd
                awuduh awiuhdhawaiowf uhpg8huiwegh pwrg [90uqefhohf oihewf ugh
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <p>2 day ago</p>
              <p className="badge badge-primary ms-auto">10</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default MessagePage;
