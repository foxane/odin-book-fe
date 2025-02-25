import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { userService } from "../../utils/services";
import { PencilIcon } from "lucide-react";
import Avatar from "react-avatar";
import { twMerge } from "tailwind-merge";
import PostSection from "./PostSection";
import useAuth from "../../context/AuthContext";
import { useState } from "react";
import { UserUpdateModal } from "./UpdateModal";
import FollowerSection from "./FollowerSection";
import FollowingSection from "./FollowingSection";
import useUserInfinite from "../../hooks/useUserInfinite";
// import ChatButton from "./ChatButton";

export default function UserPage() {
  const authUser = useAuth((s) => s.user);

  const [updateModal, setUpdateModal] = useState(false);

  const { userId } = useParams();
  const queryKey = ["user", userId];
  const { data: user } = useQuery({
    queryKey,
    queryFn: () => userService.getOne(userId!),
  });
  const { follow } = useUserInfinite(queryKey);
  const isOwner = authUser && authUser.id === user?.id;

  if (!user) return <div className="loading"></div>;
  return (
    <div className="space-y-2">
      <div className="bg-base-100 rounded pb-1">
        {/* Background */}
        <div className="bg-base-300 relative aspect-video">
          <img
            className="h-full w-full object-cover"
            src={user.background ?? ""}
            alt="No image"
          />
        </div>

        {/* User info */}
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 px-2">
          <div className="relative row-span-2 flex">
            <Avatar
              name={user.name}
              src={user.avatar ?? ""}
              size="70"
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

          <div className="row-span-2">
            {isOwner ? (
              <button
                className="btn btn-sm btn-square btn-ghost"
                onClick={() => setUpdateModal(true)}
              >
                <PencilIcon />
              </button>
            ) : (
              <button
                disabled={follow.isPending}
                onClick={() => follow.mutate(user)}
                className={twMerge(
                  "btn btn-primary btn-sm",
                  user.isFollowed && "btn-outline",
                )}
              >
                {user.isFollowed ? "Unfollow" : "Follow"}
              </button>
            )}
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

      {/* {!isOwner && (
        <div className="flex justify-end">
          <ChatButton target={user} />
        </div>
      )} */}

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

      {authUser && (
        <UserUpdateModal
          visible={updateModal}
          onClose={() => setUpdateModal(false)}
          user={authUser}
        />
      )}
    </div>
  );
}
