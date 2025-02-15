import { useState } from "react";
import Modal from "../../components/Modal";
import ImageUpdateField from "./ImageUpdateField";

interface UUModal {
  visible: boolean;
  onClose: () => void;
  user: User;
}
export const UserUpdateModal = ({ visible, onClose, user }: UUModal) => {
  const { name, bio, email } = user;
  const [payload, setPayload] = useState<UserUpdatePayload>({
    name,
    bio,
    email,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  return (
    <Modal onClose={onClose} visible={visible}>
      <ImageUpdateField user={user} />

      {/* Data */}
      <div className="space-y-5">
        {/*           {error && (
            <div className="alert-soft alert alert-vertical alert-error my-2">
              <p className="card-title">{error.message}</p>
              {error.errorDetails && (
                <ul>
                  {error.errorDetails.map((el) => (
                    <li key={el}>{el}</li>
                  ))}
                </ul>
              )}
            </div>
          )} */}

        <label className="floating-label">
          <input
            className="input w-full"
            type="text"
            name="name"
            value={payload.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <span>Name</span>
        </label>

        <label className="floating-label">
          <input
            className="input w-full"
            type="email"
            name="email"
            value={payload.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <span>Email</span>
        </label>

        <label className="floating-label mb-7">
          <textarea
            name="bio"
            className="textarea w-full"
            placeholder="No bio set"
            value={payload.bio ?? ""}
            onChange={handleChange}
          />
          <span>Bio</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <form method="dialog">
          <button className="btn mt-5" onClick={onClose}>
            Cancel
          </button>
        </form>
        {/*           <button
            className="btn btn-primary mt-5"
            onClick={() => update(payload)}
            disabled={loading}
          >
            {!loading ? "Save changes" : <span className="loading" />}
          </button> */}
      </div>
    </Modal>
  );
};
