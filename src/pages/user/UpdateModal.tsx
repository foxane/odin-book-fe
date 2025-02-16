import Modal from "../../components/Modal";
import ImageUpdateField from "./ImageUpdateField";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submitting", data);
  };

  return (
    <Modal onClose={onClose} visible={visible}>
      <ImageUpdateField user={user} />

      <form>
        {/* Name */}
        <label className="floating-label">
          <span>Name</span>
          <input
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
            className="textarea w-full"
            placeholder="No bio set"
            {...register("bio")}
          />
        </label>
      </form>

      <div className="flex justify-end gap-2">
        <p className="ms-auto">{isSubmitting && "Submitting"}</p>
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
          disabled={!isDirty || !isValid}
          className="btn btn-primary mt-5"
          type="submit"
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
};
