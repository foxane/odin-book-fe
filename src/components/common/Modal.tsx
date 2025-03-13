import { forwardRef, useEffect, useRef, useState } from "react";
import { addPTag, isComment, removePTag } from "../../utils/helpers";
import { AlertOctagon, EditIcon } from "lucide-react";

const Modal = forwardRef<
  HTMLDialogElement,
  {
    children: React.ReactNode;
    onClose: () => void;
  } & React.HTMLAttributes<HTMLDialogElement>
>(({ children, onClose, ...props }, ref) => {
  return (
    <dialog className="modal" {...props} ref={ref} onCancel={onClose}>
      <div className="modal-box card max-w-96 p-0">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}></button>
      </form>
    </dialog>
  );
});
Modal.displayName = "Modal";
export default Modal;

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = (onClose: () => void, data: unknown) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (data) ref.current.showModal();
    else {
      onClose();
      ref.current.close();
    }
  }, [data, onClose, ref]);

  return ref;
};

interface Props {
  data: Post | IComment | null;
  submit: () => void;
  onClose: () => void;
}

export function DeleteModal({ data, submit, onClose }: Props) {
  const ref = useModal(onClose, data);

  if (!data) return null;

  const resName = isComment(data) ? "comment" : "post";
  return (
    <Modal ref={ref} onClose={onClose}>
      <div className="card-body space-y-3">
        <h2 className="card-title">
          <AlertOctagon />
          Delete post
        </h2>

        <div>
          <p>Are you sure you wanted to delete this {resName}?</p>
          <p>This action cannot be undone!</p>
        </div>

        <div className="card-actions justify-end">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              submit();
            }}
            className="btn btn-error"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}

interface UpdateProps extends Pick<Props, "data" | "onClose"> {
  submit: (post: Post | IComment) => void;
}

export function UpdateModal({ data, submit, onClose }: UpdateProps) {
  const ref = useModal(onClose, data);
  const [text, setText] = useState(removePTag(data?.text));

  if (!data) return null;

  const handleSubmit = () => {
    onClose();
    if (isComment(data)) {
      submit({ ...data, text: addPTag(text), postId: data.postId });
    } else {
      submit({ ...data, text: addPTag(text) });
    }
  };

  const resName = isComment(data) ? "comment" : "post";
  return (
    <Modal ref={ref} onClose={onClose}>
      <div className="card-body">
        <h2 className="card-title">
          <EditIcon /> Edit {resName}
        </h2>

        <textarea
          className="textarea w-full rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="card-actions justify-end">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
