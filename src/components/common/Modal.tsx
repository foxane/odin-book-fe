import { forwardRef, useEffect, useRef, useState } from "react";

const Modal = forwardRef<
  HTMLDialogElement,
  {
    children: React.ReactNode;
    onClose: () => void;
  } & React.HTMLAttributes<HTMLDialogElement>
>(({ children, onClose, ...props }, ref) => {
  return (
    <dialog className="modal" {...props} ref={ref} onCancel={onClose}>
      <div className="modal-box">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}></button>
      </form>
    </dialog>
  );
});
Modal.displayName = "Modal";
export default Modal;

const useModal = (onClose: () => void, data: unknown) => {
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
  data: Post | null;
  submit: () => void;
  onClose: () => void;
}

export function DeleteModal({ data, submit, onClose }: Props) {
  const ref = useModal(onClose, data);

  if (!data) return null;
  return (
    <Modal ref={ref} onClose={onClose}>
      <div>
        <h2 className="text-xl">Delete post?</h2>
        <div>
          <p>You are about to delete post:</p>
          <div dangerouslySetInnerHTML={{ __html: data.text }} />
        </div>
        <button
          className="btn btn-error"
          onClick={() => {
            onClose();
            submit();
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

interface UpdateProps extends Pick<Props, "data" | "onClose"> {
  submit: (post: Post) => void;
}

export function UpdateModal({ data, submit, onClose }: UpdateProps) {
  const ref = useModal(onClose, data);
  const [text, setText] = useState(data?.text ?? "");

  if (!data) return null;
  return (
    <Modal ref={ref} onClose={onClose}>
      <div>
        <h2 className="text-xl">Update</h2>
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button
          className="btn btn-error"
          onClick={() => {
            onClose();
            submit({ ...data, text });
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
