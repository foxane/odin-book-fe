import { HTMLAttributes, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

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
    onClose();
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
