/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PencilIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { api } from "../../utils/services";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../context/AuthContext";
import { AuthResponse } from "../../utils/authHelper";
import Img from "../common/Img";
import Avatar from "react-avatar";
import { toast } from "react-toastify";

interface Props {
  user: User;
}

function ImageUpdateField({ user }: Props) {
  const client = useQueryClient();
  const login = useAuth((s) => s.login);
  const [loading, setLoading] = useState(false);

  const [bg, setBg] = useState<File | null>(null);
  const bgPreview = bg && URL.createObjectURL(bg);

  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarPreview = avatar && URL.createObjectURL(avatar);

  const handleSubmit = async (field: "avatar" | "background", file: File) => {
    if (file.size > 1024 * 1024 * 10) {
      toast.error("Image is too big! Maximum allowed are 10MB");
      field === "avatar" ? setAvatar(null) : setBg(null);
      return;
    }

    const formData = new FormData();
    formData.append(field, file);

    setLoading(true);
    const loadingToast = toast.loading(`Updating ${field}...`);
    try {
      const { data } = await api.axios.patch<AuthResponse>(
        `/users/${user.id}/${field}`,
        formData,
      );
      field === "avatar" ? setAvatar(null) : setBg(null);
      client.setQueryData(["user", user.id.toString()], (old: User) => ({
        ...old,
        avatar: data.user.avatar,
        background: data.user.background,
      }));
      void login(data.token, data.user);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to update ${field}`,
      );
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <>
      <div className="relative aspect-video overflow-hidden">
        <Img src={bgPreview ?? user.background ?? ""} />

        {/* BG actions */}
        <div className="absolute right-2 top-2 flex gap-2">
          {bg && (
            <>
              <button
                disabled={loading}
                onClick={() => void handleSubmit("background", bg)}
                data-tip="Save background"
                className="tooltip tooltip-left btn btn-square btn-sm btn-primary flex items-center"
              >
                <SaveIcon size={18} />
              </button>

              <button
                disabled={loading}
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
        <div className="bg-base-300 rounded-full">
          <Avatar
            name={user.name}
            src={avatarPreview ?? user.avatar ?? undefined}
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
                disabled={loading}
                onClick={() => void handleSubmit("avatar", avatar)}
                data-tip="Save avatar"
                className="tooltip tooltip-left btn btn-square btn-sm btn-primary flex items-center"
              >
                <SaveIcon size={18} />
              </button>

              <button
                disabled={loading}
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
