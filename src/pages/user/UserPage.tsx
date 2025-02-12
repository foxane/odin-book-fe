import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { userService } from "../../utils/services";
import { EllipsisIcon, ImageOffIcon } from "lucide-react";
import Avatar from "react-avatar";
import { twMerge } from "tailwind-merge";
import PostSection from "./PostSection";
import useAuth from "../../hooks/useAuth";

export default function UserPage() {
  const { userId } = useParams();
  const auth = useAuth();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getOne(userId!),
  });

  const owner = auth.user && auth.user.id === user?.id;

  if (!user) return <div className="loading"></div>;
  return (
    <div className="">
      <div className="bg-base-100 rounded pb-1">
        {/* Background */}
        <div className="bg-base-300 flex aspect-video items-center">
          <ImageOffIcon size={100} className="mx-auto opacity-10" />
        </div>

        {/* User info */}
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-2 px-2">
          <Avatar
            name={user.name}
            size="50"
            maxInitials={2}
            className="avatar avatar-online row-span-2"
            textSizeRatio={2}
            round
          />

          <div className="flex items-center gap-3">
            <p className="font-semibold">{user.name}</p>
          </div>

          <div className="col-start-2 row-start-2 flex gap-2 text-xs">
            <p>Followers {user._count.follower}</p>
            <p>Following {user._count.following}</p>
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
            <button className="btn btn-sm btn-square btn-ghost">
              <EllipsisIcon />
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

      {/* Tabs */}

      <div className="divider">Posts</div>
      {/* Post section */}
      <PostSection userId={userId!} />
    </div>
  );
}
