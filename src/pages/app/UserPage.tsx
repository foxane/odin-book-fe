import { useParams } from "react-router-dom";
import { RouteParams } from "../../App";
import LoadingScreen from "../../components/common/LoadingScreen";
import UserAvatar from "../../components/user/UserAvatar";
import useAuth from "../../context/AuthContext";
import { PencilIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Img from "../../components/common/Img";
import useUserPage from "../../hooks/useUserPage";
import { UserUpdateModal } from "../../components/user/UserUpdateModal";
import { useState } from "react";
import { createUserPageKey } from "../../utils/constants";
import PostList from "../../components/post/PostList";
import UserList from "../../components/user/UserList";

function UserPage() {
  const { userId } = useParams<RouteParams>();
  const authUser = useAuth((s) => s.user);
  const keys = createUserPageKey(userId!);

  const { userQuery, postQuery, followerQuery, followingQuery, followUser } =
    useUserPage(userId!, keys);
  const user = userQuery.data;

  const isOwner = userQuery.data?.id === authUser?.id;
  const [updateModal, setUpdateModal] = useState(false);

  if (userQuery.isPending) return <LoadingScreen />;
  if (!user) return <p>{userQuery.error.message}</p>;
  return (
    <div className="space-y-2">
      <div className="rounded pb-1">
        {/* Background */}
        <div className="bg-base-300 relative aspect-video">
          <Img src={user.background} />
        </div>

        {/* User info */}
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 px-2">
          <div className="relative row-span-2 flex">
            <UserAvatar user={user} />
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
                onClick={() => followUser.mutate(userQuery.data)}
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

      {!isOwner && (
        <div className="flex justify-end">
          chatbtn here
          {/* <ChatButton targetId={user.id} /> */}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-border">
        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Posts"
          defaultChecked
        />
        <div className="tab-content mt-5">
          <PostList query={postQuery} queryKey={keys.postKey} />
        </div>

        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Followers"
        />
        <div className="tab-content mt-2">
          <UserList query={followerQuery} queryKey={keys.followerKey} />
        </div>

        <input
          type="radio"
          name="tab"
          className="tab grow"
          aria-label="Following"
        />
        <div className="tab-content mt-2">
          <UserList query={followingQuery} queryKey={keys.followingKey} />
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

export default UserPage;
