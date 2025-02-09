import { useState } from "react";
import Modal from "../ui/Modal";
import { removePTag } from "../../lib/utils";
import { AlertOctagonIcon, NotebookPenIcon } from "lucide-react";
import Textarea from "../ui/Textarea";

interface Props {
  post: Post;
  submit: (post: Post) => void;
  onClose: () => void;
}

export function UpdatePostModal({ post, onClose, submit }: Props) {
  const [text, setText] = useState(removePTag(post.text));

  const handleSubmit = () => {
    const updated: Post = { ...post, text };
    submit(updated);
    onClose();
  };

  return (
    <Modal visible={true} onClose={onClose}>
      <div className="space-y-5">
        <p className="card-title">
          <NotebookPenIcon />
          Update post
        </p>
        <Textarea handleChange={setText} value={text} />

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

export function DeletePostModal({ post, onClose, submit }: Props) {
  const handleSubmit = () => {
    submit(post);
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
