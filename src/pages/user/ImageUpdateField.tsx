/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PencilIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Avatar from "react-avatar";
import { api } from "../../utils/services";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";

interface Props {
  user: User;
}

function ImageUpdateField({ user }: Props) {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const [bg, setBg] = useState<File | null>(null);
  const bgPreview = bg && URL.createObjectURL(bg);

  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarPreview = avatar && URL.createObjectURL(avatar);

  const handleSubmit = async (field: "avatar" | "background", file: File) => {
    if (file.size > 1024 * 1024 * 10) {
      alert("Image is too big! Maximum allowed are 10MB");
      field === "avatar" ? setAvatar(null) : setBg(null);
      return;
    }

    const formData = new FormData();
    formData.append(field, file);

    try {
      const { data } = await api.axios.patch<AuthResponse>(
        `/users/${user.id}/${field}`,
        formData,
      );
      api.setToken(data.token);
      field === "avatar" ? setAvatar(null) : setBg(null);
      await queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      await refreshUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={bgPreview ?? user.background ?? ""}
          alt={user.name + "background"}
        />

        {/* BG actions */}
        <div className="absolute right-2 top-2 flex gap-2">
          {bg && (
            <>
              <button
                onClick={() => void handleSubmit("background", bg)}
                data-tip="Save background"
                className="tooltip tooltip-left btn btn-square btn-sm btn-primary flex items-center"
              >
                <SaveIcon size={18} />
              </button>

              <button
                onClick={() => setBg(null)}
                data-tip="Cancel"
                className="tooltip tooltip-left btn btn-square btn-sm btn-error flex items-center"
              >
                <XIcon size={18} />
              </button>
            </>
          )}

          <label
            data-tip="Change background"
            className="tooltip btn btn-sm btn-square tooltip-left flex items-center"
          >
            <PencilIcon size={18} />
            <input
              type="file"
              className="hidden"
              onChange={({ target }) =>
                target.files?.[0] && setBg(target.files[0])
              }
            />
          </label>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative -top-10 flex items-end">
        <div className="bg-base-300 rounded-full p-2">
          <Avatar
            name={user.name}
            src={avatarPreview ?? user.avatar ?? ""}
            size="70"
            maxInitials={2}
            className="avatar"
            textSizeRatio={2}
            round
          />
        </div>

        {/* Avatar actions */}
        <div className="flex gap-2">
          <label
            data-tip="Change avatar"
            className="tooltip btn btn-sm btn-square flex items-center"
          >
            <PencilIcon size={18} />
            <input
              type="file"
              className="hidden"
              onChange={({ target }) =>
                target.files?.[0] && setAvatar(target.files[0])
              }
            />
          </label>

          {avatar && (
            <>
              <button
                onClick={() => void handleSubmit("avatar", avatar)}
                data-tip="Save avatar"
                className="tooltip tooltip-left btn btn-square btn-sm btn-primary flex items-center"
              >
                <SaveIcon size={18} />
              </button>

              <button
                onClick={() => setAvatar(null)}
                data-tip="Cancel"
                className="tooltip tooltip-left btn btn-square btn-sm btn-error flex items-center"
              >
                <XIcon size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ImageUpdateField;
