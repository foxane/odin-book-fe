import React, { HTMLAttributes, useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { removePTag } from "../utils/helper";
import { AlertOctagonIcon, NotebookPenIcon } from "lucide-react";
import Textarea from "./Textarea";

interface Props extends HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  onClose: () => void;
}

export default function Modal({ visible, onClose, ...props }: Props) {
  const modalRef = useRef<null | HTMLDialogElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;

    if (visible) modalRef.current.showModal();
    else modalRef.current.close();
  }, [visible]);

  const handleClose = () => {
    // Adding delay for animation
    if (modalRef.current) modalRef.current.close();
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleESC = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <dialog ref={modalRef} className="modal" onCancel={handleESC}>
      <div className={twMerge("modal-box", props.className)} {...props}>
        {props.children}
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} />
      </form>
    </dialog>
  );
}

interface ActionModalProps<T> {
  resource: T;
  submit: (resource: T) => void;
  onClose: () => void;
}

export function UpdateModal<T extends Post | IComment>({
  resource,
  onClose,
  submit,
}: ActionModalProps<T>) {
  const [text, setText] = useState(removePTag(resource.text));

  const handleSubmit = () => {
    submit({ ...resource, text });
    onClose();
  };

  return (
    <Modal visible={true} onClose={onClose}>
      <div className="space-y-5">
        <p className="card-title">
          <NotebookPenIcon />
          Update post
        </p>
        <div className="relative">
          <Textarea handleChange={setText} value={text} />
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn btn-neutral" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function DeleteModal<T extends Post | IComment>({
  resource,
  onClose,
  submit,
}: ActionModalProps<T>) {
  const handleSubmit = () => {
    submit(resource);
    onClose();
  };

  return (
    <Modal visible={true} onClose={onClose}>
      <div className="space-y-5">
        <div className="card-title">
          <AlertOctagonIcon />
          <p>Delete post</p>
        </div>

        <p className="">This action cannot be undone!</p>

        <div className="flex items-center justify-end gap-2">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-md btn-error" onClick={handleSubmit}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
