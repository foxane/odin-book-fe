import { useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { api } from "../../utils/services";
import ImageUpdateField from "./ImageUpdateFIeld";
import Modal, { useModal } from "../common/Modal";
import { AuthResponse } from "../../utils/authHelper";
import useAuth from "../../context/AuthContext";

interface UserUpdatePayload {
  name: string;
  email: string;
  bio: string;
}

interface UUModal {
  visible: boolean;
  onClose: () => void;
  user: User;
}
export const UserUpdateModal = ({ visible, onClose, user }: UUModal) => {
  const client = useQueryClient();
  const login = useAuth((s) => s.login);
  const currentUser = useAuth((s) => s.user)!;
  const disableAction = currentUser.role === "GUEST";

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors, isValid },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio ?? "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<UserUpdatePayload> = async (data) => {
    try {
      const { data: res } = await api.axios.put<AuthResponse>(
        `/users/${user.id}`,
        data,
      );
      await login(res.token, res.user);
      client.setQueryData(["user", res.user.id.toString()], (old: User) => ({
        ...old,
        ...data,
      }));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const ref = useModal(onClose, visible);

  return (
    <Modal onClose={onClose} ref={ref}>
      <div className="card-body">
        <ImageUpdateField user={user} />

        <form>
          {/* Name */}
          <label className="floating-label">
            <span>Name</span>
            <input
              disabled={disableAction}
              placeholder="Name"
              className="input w-full"
              {...register("name", {
                minLength: 3,
                maxLength: 20,
                required: true,
              })}
            />
            <p
              className={twMerge(
                "validator-hint text-error opacity-0",
                errors.name && "opacity-100",
              )}
            >
              Name must be 3-20 characters
            </p>
          </label>

          {/* Email */}
          <label className="floating-label">
            <span>Email</span>
            <input
              disabled={disableAction}
              type="email"
              placeholder="Email"
              className="input w-full"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+\.\S+$/,
              })}
            />
            <p
              className={twMerge(
                "validator-hint text-error opacity-0",
                errors.email && "opacity-100",
              )}
            >
              Must be a valid email
            </p>
          </label>

          <label className="floating-label">
            <span>Bio</span>
            <textarea
              disabled={disableAction}
              className="textarea w-full"
              placeholder="No bio set"
              {...register("bio")}
            />
          </label>
          {disableAction && (
            <p className="validator-hint text-error">
              Guest account can only change avatar and backgroud
            </p>
          )}
        </form>

        <div className="flex justify-end gap-2">
          <form method="dialog">
            <button
              className="btn mt-5"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </button>
          </form>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty || !isValid || isSubmitting || disableAction}
            className="btn btn-primary mt-5"
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span className="loading" />
                Saving changes...
              </>
            ) : (
              "save changes"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
