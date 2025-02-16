import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { userService } from "../../utils/services";
import { PencilIcon } from "lucide-react";
import Avatar from "react-avatar";
import { twMerge } from "tailwind-merge";
import PostSection from "./PostSection";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { UserUpdateModal } from "./UpdateModal";
import FollowerSection from "./FollowerSection";
import FollowingSection from "./FollowingSection";

export default function UserPage() {
  const { userId } = useParams();
  const auth = useAuth();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getOne(userId!),
  });

  const owner = auth.user && auth.user.id === user?.id;

  const [modal, setModal] = useState(false);

  if (!user) return <div className="loading"></div>;
  return (
    <div className="">
      <div className="bg-base-100 rounded pb-1">
        {/* Background */}
        <div className="bg-base-300 relative aspect-video">
          <img
            className="h-full w-full object-cover"
            src={user.background ?? ""}
          />
        </div>

        {/* User info */}
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 px-2">
          <div className="relative row-span-2 flex">
            <Avatar
              name={user.name}
              src={user.avatar ?? ""}
              size="80"
              maxInitials={2}
              className="avatar avatar-online"
              textSizeRatio={2}
              round
            />
          </div>

          <div className="flex items-center gap-3">
            <p className="font-semibold">{user.name}</p>
          </div>

          <div className="col-start-2 row-start-2 flex gap-2 text-xs">
            <p>
              Followers
              <span className="ps-1 font-bold">{user._count.follower}</span>
            </p>
            <p>
              Following
              <span className="ps-1 font-bold">{user._count.following}</span>
            </p>
          </div>

          <div className="row-span-2 flex gap-2">
            <button
              className={twMerge(
                "btn btn-primary btn-sm",
                user.isFollowed && "btn-outline",
                owner && "hidden",
              )}
            >
              {user.isFollowed ? "Unfollow" : "Follow"}
            </button>
            <button
              className="btn btn-sm btn-square btn-ghost"
              onClick={() => setModal(true)}
            >
              <PencilIcon />
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="m-5">
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html:
                user.bio ??
                "<i class='label'>This user hasn&apos;t set a bio</i>",
            }}
          />
        </div>
      </div>

      <div className="divider" />

      {/* Tabs */}
      <div className="tabs tabs-box">
        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Posts"
          defaultChecked
        />
        <div className="tab-content mt-2">
          <PostSection userId={userId!} />
        </div>

        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Followers"
        />
        <div className="tab-content mt-2">
          <FollowerSection userId={userId!} />
        </div>

        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Following"
        />
        <div className="tab-content mt-2">
          <FollowingSection userId={userId!} />
        </div>
      </div>

      {auth.user && (
        <UserUpdateModal
          visible={modal}
          onClose={() => setModal(false)}
          user={auth.user}
        />
      )}
    </div>
  );
}
